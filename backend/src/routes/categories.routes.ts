import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { children: { where: { isActive: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(categories);
});

router.get('/all', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { children: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(categories);
});

router.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json(category);
});

router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(category);
});

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.category.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  res.json({ success: true });
});

export default router;
