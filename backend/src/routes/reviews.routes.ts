import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId, isActive: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const stats = await prisma.review.aggregate({
    where: { productId: req.params.productId, isActive: true },
    _avg: { rating: true },
    _count: true,
  });

  res.json({ reviews, average: stats._avg.rating, count: stats._count });
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      productId: z.string(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().optional(),
    });
    const data = schema.parse(req.body);

    const existing = await prisma.review.findFirst({
      where: { productId: data.productId, userId: req.user!.id },
    });
    if (existing) return res.status(400).json({ error: 'شما قبلاً نظر داده‌اید' });

    const review = await prisma.review.create({
      data: { ...data, userId: req.user!.id },
      include: { user: { select: { name: true } } },
    });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to create review' });
  }
});

router.get('/admin', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (_req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
});

router.put('/:id/toggle', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ error: 'Not found' });

  const updated = await prisma.review.update({
    where: { id: req.params.id },
    data: { isActive: !review.isActive },
  });
  res.json(updated);
});

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
