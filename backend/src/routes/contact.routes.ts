import { Router } from 'express';
import { z } from 'zod';
import { hyperConfig } from '../services/hyperconfig.service';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

router.post('/', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);

    const messages = ((await hyperConfig.get('contact_messages')) as unknown[]) || [];
    const entry = { ...data, createdAt: new Date().toISOString(), id: Date.now() };

    await hyperConfig.set('contact_messages', [...messages, entry].slice(-100));

    res.json({ success: true, message: 'پیام شما با موفقیت ارسال شد' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'ارسال پیام ناموفق بود' });
  }
});

router.get('/messages', async (_req, res) => {
  const messages = await hyperConfig.get('contact_messages');
  res.json(messages || []);
});

export default router;
