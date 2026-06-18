import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN'));

router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      isBlocked: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.put('/:id', async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1).optional(),
      phone: z.string().nullable().optional(),
      role: z.nativeEnum(UserRole).optional(),
      isActive: z.boolean().optional(),
      isBlocked: z.boolean().optional(),
    });
    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        isBlocked: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;
