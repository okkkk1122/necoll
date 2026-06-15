import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NC-${date}-${random}`;
}

router.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req, res) => {
  const { status, page = '1', limit = '20' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  const where = status ? { status: status as never } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ orders, pagination: { page: pageNum, limit: limitNum, total } });
});

router.get('/my', authenticate, async (req: AuthRequest, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Product unavailable: ${item.productId}` });
      }
      const price = Number(product.price);
      subtotal += price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price, options: item.options });
    }

    const shippingCost = subtotal >= 1000000 ? 0 : 50000;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user!.id,
        subtotal,
        shippingCost,
        total,
        shippingAddress,
        paymentMethod,
        notes,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/:id/status', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  });
  res.json(order);
});

export default router;
