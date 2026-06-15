import { Router } from 'express';
import { hyperConfig } from '../services/hyperconfig.service';

const router = Router();

router.get('/:slug', async (req, res) => {
  const pages = (await hyperConfig.get('static_pages')) as Record<string, unknown> | null;
  const page = pages?.[req.params.slug];

  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  res.json(page);
});

router.get('/', async (_req, res) => {
  const pages = (await hyperConfig.get('static_pages')) as Record<string, unknown> | null;
  res.json(pages || {});
});

export default router;
