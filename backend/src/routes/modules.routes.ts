import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { cacheDel } from '../lib/redis';

const router = Router();

router.get('/', async (_req, res) => {
  const modules = await prisma.module.findMany({
    include: {
      components: {
        orderBy: { sortOrder: 'asc' },
        include: { children: { orderBy: { sortOrder: 'asc' } } },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(modules);
});

router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN'));

router.post('/', async (req, res) => {
  const module = await prisma.module.create({ data: req.body });
  await cacheDel('hyperconfig:*');
  res.status(201).json(module);
});

router.put('/:id', async (req, res) => {
  const module = await prisma.module.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await cacheDel('hyperconfig:*');
  res.json(module);
});

router.delete('/:id', async (req, res) => {
  await prisma.module.delete({ where: { id: req.params.id } });
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

router.post('/:moduleId/components', async (req, res) => {
  const component = await prisma.component.create({
    data: { ...req.body, moduleId: req.params.moduleId },
  });
  await cacheDel('hyperconfig:*');
  res.status(201).json(component);
});

router.put('/components/:id', async (req, res) => {
  const component = await prisma.component.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await cacheDel('hyperconfig:*');
  res.json(component);
});

router.put('/components/reorder', async (req, res) => {
  const { items } = req.body as { items: { id: string; sortOrder: number; parentId?: string }[] };
  await Promise.all(
    items.map((item) =>
      prisma.component.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder, parentId: item.parentId },
      })
    )
  );
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

router.delete('/components/:id', async (req, res) => {
  await prisma.component.delete({ where: { id: req.params.id } });
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

export default router;
