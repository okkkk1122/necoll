import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { zarinpalService } from '../services/zarinpal.service';
import { hyperConfig } from '../services/hyperconfig.service';

const router = Router();

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NC-${date}-${random}`;
}

router.get('/gateways', async (_req, res) => {
  const gateways = (await hyperConfig.get('payment_gateways')) as Record<string, boolean> | null;
  const zarinpalEnabled = await zarinpalService.isEnabled();
  res.json({
    zarinpal: zarinpalEnabled,
    gateways: gateways || {},
  });
});

router.post('/checkout', authenticate, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, notes, couponCode } = req.body;

    if (!items?.length) {
      return res.status(400).json({ error: 'سبد خرید خالی است' });
    }

    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: number;
      options?: Prisma.InputJsonValue;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive || product.stock < item.quantity) {
        return res.status(400).json({ error: `محصول "${product?.slug || item.productId}" موجود نیست` });
      }
      const price = Number(product.price);
      subtotal += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        options: item.options as Prisma.InputJsonValue | undefined,
      });
    }

    const shippingConfig = (await hyperConfig.get('shipping_config')) as {
      baseCost: number;
      freeThreshold: number;
    } | null;
    const baseCost = shippingConfig?.baseCost ?? 50000;
    const freeThreshold = shippingConfig?.freeThreshold ?? 1000000;
    const shippingCost = subtotal >= freeThreshold ? 0 : baseCost;

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (!coupon.minOrder || subtotal >= Number(coupon.minOrder)) {
            if (coupon.discountType === 'percentage') {
              discount = subtotal * (Number(coupon.discountValue) / 100);
            } else {
              discount = Number(coupon.discountValue);
            }
          }
        }
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user!.id,
        status: 'PENDING',
        subtotal,
        shippingCost,
        discount,
        total,
        shippingAddress,
        paymentMethod: 'zarinpal',
        notes,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    const zarinpalEnabled = await zarinpalService.isEnabled();
    if (!zarinpalEnabled) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paymentRef: 'DEMO-' + Date.now() },
      });
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return res.json({
        order,
        paymentUrl: null,
        demo: true,
        message: 'پرداخت آزمایشی — درگاه فعال نیست',
      });
    }

    const siteUrl = process.env.SITE_URL || 'http://localhost:3011';
    const payment = await zarinpalService.requestPayment({
      amount: Math.round(total),
      description: `سفارش ${order.orderNumber}`,
      callbackUrl: `${siteUrl}/checkout/callback?orderId=${order.id}`,
      email: req.user!.email,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: payment.authority },
    });

    res.json({
      order,
      paymentUrl: payment.paymentUrl,
      authority: payment.authority,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    res.status(500).json({ error: message });
  }
});

async function verifyPaymentHandler(
  orderId: string | undefined,
  authority: string | undefined,
  status: string | undefined
) {
  if (!orderId) throw new Error('Invalid order');

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new Error('Order not found');

  if (status !== 'OK' || !authority) {
    await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } });
    return { success: false, message: 'پرداخت لغو شد', orderNumber: order.orderNumber };
  }

  const result = await zarinpalService.verifyPayment(authority, Math.round(Number(order.total)));

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID', paymentRef: String(result.refId) },
  });

  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return {
    success: true,
    refId: result.refId,
    orderNumber: order.orderNumber,
    message: 'پرداخت با موفقیت انجام شد',
  };
}

router.get('/verify', async (req, res) => {
  try {
    const { Authority, Status, orderId } = req.query;
    const result = await verifyPaymentHandler(
      orderId as string,
      Authority as string,
      Status as string
    );
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
