import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, optionalAuth, AuthRequest } from '../middleware/auth';
import { businessRulesEngine } from '../services/business-rules.service';

const router = Router();

// Product field definitions (must be before /:slug)
router.get('/fields/definitions', async (_req, res) => {
  const fields = await prisma.productFieldDefinition.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  res.json(fields);
});

router.put('/fields/definitions/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const field = await prisma.productFieldDefinition.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(field);
});

router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, featured, search, page = '1', limit = '12' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = { isActive: true };
    if (category) where.categoryId = category;
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { slug: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const rules = await prisma.businessRule.findMany({ where: { isActive: true } });
    const enriched = products.map((product) => ({
      ...product,
      badges: businessRulesEngine.evaluate(rules as never[], {
        stock: product.stock,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        isFeatured: product.isFeatured,
      }),
    }));

    res.json({
      products: enriched,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:slug', optionalAuth, async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      reviews: {
        where: { isActive: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) return res.status(404).json({ error: 'Product not found' });

  const rules = await prisma.businessRule.findMany({ where: { isActive: true } });
  const badges = businessRulesEngine.evaluate(rules as never[], {
    stock: product.stock,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    isFeatured: product.isFeatured,
  });

  res.json({ ...product, badges });
});

// Admin CRUD
router.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const schema = z.object({
      slug: z.string(),
      name: z.record(z.string()),
      description: z.record(z.string()).optional(),
      price: z.number().positive(),
      comparePrice: z.number().optional(),
      stock: z.number().int().min(0),
      sku: z.string().optional(),
      images: z.array(z.string()).optional(),
      categoryId: z.string().optional(),
      dynamicFields: z.record(z.unknown()).optional(),
      isFeatured: z.boolean().optional(),
    });
    const data = schema.parse(req.body);
    const product = await prisma.product.create({ data: data as never });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.product.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  res.json({ success: true });
});

export default router;
