import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiChatService } from '../services/ai-chat.service';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/status', async (_req, res) => {
  const enabled = await aiChatService.isEnabled();
  const welcome = await aiChatService.getWelcomeMessage();
  const suggestions = aiChatService.getSuggestions();
  res.json({ enabled, welcome, suggestions });
});

router.post('/message', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { content, sessionId } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const sid = sessionId || uuidv4();
    const response = await aiChatService.sendMessage(sid, content, req.user?.id);

    res.json({ sessionId: sid, ...response });
  } catch (error) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

router.get('/history/:sessionId', async (req, res) => {
  const history = await aiChatService.getHistory(req.params.sessionId);
  res.json(history);
});

export default router;
