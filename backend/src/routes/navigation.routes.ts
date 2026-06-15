import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { cacheDel } from '../lib/redis';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await prisma.navigationItem.findMany({
    where: { parentId: null, isActive: true },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(items);
});

router.get('/routes', async (_req, res) => {
  const routes = await prisma.routeConfig.findMany({ orderBy: { path: 'asc' } });
  res.json(routes);
});

router.get('/all', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const items = await prisma.navigationItem.findMany({
    where: { parentId: null },
    include: {
      children: {
        orderBy: { sortOrder: 'asc' },
        include: { children: { orderBy: { sortOrder: 'asc' } } },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
  res.json(items);
});

router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN'));

router.post('/items', async (req, res) => {
  const item = await prisma.navigationItem.create({ data: req.body });
  await cacheDel('hyperconfig:*');
  res.status(201).json(item);
});

router.put('/items/:id', async (req, res) => {
  const item = await prisma.navigationItem.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await cacheDel('hyperconfig:*');
  res.json(item);
});

router.put('/items/reorder', async (req, res) => {
  const { items } = req.body as { items: { id: string; sortOrder: number; parentId?: string }[] };
  await Promise.all(
    items.map((item) =>
      prisma.navigationItem.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder, parentId: item.parentId },
      })
    )
  );
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

router.delete('/items/:id', async (req, res) => {
  await prisma.navigationItem.delete({ where: { id: req.params.id } });
  await cacheDel('hyperconfig:*');
  res.json({ success: true });
});

router.post('/routes', async (req, res) => {
  const route = await prisma.routeConfig.create({ data: req.body });
  await cacheDel('hyperconfig:*');
  res.status(201).json(route);
});

router.put('/routes/:id', async (req, res) => {
  const route = await prisma.routeConfig.update({
    where: { id: req.params.id },
    data: req.body,
  });
  await cacheDel('hyperconfig:*');
  res.json(route);
});

export default router;
