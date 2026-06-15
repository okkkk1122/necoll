import { Router } from 'express';
import { ConfigCategory, ConfigLayer } from '@prisma/client';
import { z } from 'zod';
import { hyperConfig } from '../services/hyperconfig.service';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// Public config for storefront
router.get('/public', async (req, res) => {
  try {
    const sandboxId = req.query.sandbox as string | undefined;
    const config = await hyperConfig.getPublicConfig(sandboxId);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load config' });
  }
});

router.get('/setting/:key', async (req, res) => {
  try {
    const value = await hyperConfig.get(req.params.key, req.query.sandbox as string);
    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load setting' });
  }
});

// Admin routes
router.use(authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

router.get('/settings', async (req, res) => {
  try {
    const category = req.query.category as ConfigCategory | undefined;
    const layer = req.query.layer as ConfigLayer | undefined;
    const settings = await prisma.setting.findMany({
      where: {
        ...(category && { category }),
        ...(layer && { layer }),
      },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

router.get('/settings/:key', async (req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
  if (!setting) return res.status(404).json({ error: 'Setting not found' });
  res.json(setting);
});

router.put('/settings/:key', async (req, res) => {
  try {
    const { value, sandboxId } = req.body;
    const result = await hyperConfig.set(req.params.key, value, { sandboxId });
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed';
    res.status(400).json({ error: message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const schema = z.object({
      key: z.string().min(1),
      value: z.unknown().optional(),
      defaultValue: z.unknown().optional(),
      category: z.nativeEnum(ConfigCategory),
      layer: z.nativeEnum(ConfigLayer).optional(),
      label: z.string().optional(),
      description: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const setting = await hyperConfig.create({
      ...data,
      value: data.value ?? null,
      defaultValue: data.defaultValue ?? data.value ?? null,
    });
    res.status(201).json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

router.delete('/settings/:key', async (req, res) => {
  try {
    await hyperConfig.delete(req.params.key);
    res.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed';
    res.status(400).json({ error: message });
  }
});

router.post('/settings/:key/reset', async (req, res) => {
  try {
    const { sandboxId } = req.body;
    const result = await hyperConfig.resetToDefault(req.params.key, sandboxId);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reset failed';
    res.status(400).json({ error: message });
  }
});

router.post('/settings/:key/toggle', async (req, res) => {
  try {
    const result = await hyperConfig.toggleActive(req.params.key);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Toggle failed';
    res.status(400).json({ error: message });
  }
});

// Sandbox
router.get('/sandbox', async (_req, res) => {
  const sessions = await prisma.sandboxSession.findMany({
    where: { isActive: true },
    include: { _count: { select: { overrides: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(sessions);
});

router.post('/sandbox', async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;
    const session = await hyperConfig.createSandbox(name || 'Sandbox Session', req.user!.id);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sandbox' });
  }
});

router.post('/sandbox/:id/apply', async (req, res) => {
  try {
    const count = await hyperConfig.applySandbox(req.params.id);
    res.json({ success: true, appliedCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply sandbox' });
  }
});

router.delete('/sandbox/:id', async (req, res) => {
  try {
    await hyperConfig.discardSandbox(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to discard sandbox' });
  }
});

// Dashboard stats
router.get('/dashboard', async (_req, res) => {
  const [settingsCount, activeModules, productsCount, ordersCount, usersCount] = await Promise.all([
    prisma.setting.count(),
    prisma.module.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  const settingsByCategory = await prisma.setting.groupBy({
    by: ['category'],
    _count: true,
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  });

  res.json({
    stats: {
      settingsCount,
      activeModules,
      productsCount,
      ordersCount,
      usersCount,
    },
    settingsByCategory,
    recentOrders,
    features: await hyperConfig.getAll(),
  });
});

export default router;
