import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { cacheDel } from '../lib/redis';

const router = Router();

router.get('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (_req, res) => {
  const rules = await prisma.businessRule.findMany({ orderBy: { priority: 'desc' } });
  res.json(rules);
});

router.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const rule = await prisma.businessRule.create({ data: req.body });
  await cacheDel('hyperconfig:*');
  res.status(201).json(rule);
});

router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const rule = await prisma.businessRule.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await cacheDel('hyperconfig:*');
  res.json(rule);
});

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.businessRule.delete({ where: { id: req.params.id } });
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

export default router;
