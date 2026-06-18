import { Router } from 'express';
import { z } from 'zod';
import { hyperConfig } from '../services/hyperconfig.service';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/subscribe', async (req, res) => {
  try {
    const config = (await hyperConfig.get('newsletter_config')) as { enabled?: boolean } | null;
    if (config?.enabled === false) {
      return res.status(403).json({ error: 'Newsletter is disabled' });
    }

    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const subscribers = ((await hyperConfig.get('newsletter_subscribers')) as string[] | null) || [];

    if (subscribers.includes(email)) {
      return res.json({ success: true, message: 'Already subscribed' });
    }

    await hyperConfig.set('newsletter_subscribers', [...subscribers, email]);
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid email' });
    res.status(500).json({ error: 'Subscription failed' });
  }
});

router.get('/subscribers', authenticate, requireRole('SUPER_ADMIN', 'ADMIN'), async (_req, res) => {
  const subscribers = ((await hyperConfig.get('newsletter_subscribers')) as string[] | null) || [];
  res.json({ count: subscribers.length, subscribers });
});

export default router;
