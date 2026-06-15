import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  const published = req.query.published !== 'false';
  const posts = await prisma.blogPost.findMany({
    where: published ? { isPublished: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

router.get('/:slug', async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
  if (!post || (!post.isPublished && !req.headers.authorization)) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

router.post('/', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const post = await prisma.blogPost.create({ data: req.body });
  res.status(201).json(post);
});

router.put('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  const post = await prisma.blogPost.update({ where: { id: req.params.id }, data: req.body });
  res.json(post);
});

router.delete('/:id', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
