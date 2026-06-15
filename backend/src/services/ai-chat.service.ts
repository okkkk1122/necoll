import { prisma } from '../lib/prisma';
import { hyperConfig } from './hyperconfig.service';
import {
  buildChatKnowledgeContext,
  generateKnowledgeBasedResponse,
} from './chat-knowledge.service';

export class AIChatService {
  async isEnabled(): Promise<boolean> {
    const enabled = await hyperConfig.get('ai_chat_enabled');
    return enabled === true || enabled === 'true';
  }

  async getPrompt(): Promise<string> {
    const prompt = await hyperConfig.get('ai_chat_prompt');
    return (prompt as string) || 'شما دستیار فروشگاه نکال هستید. به مشتریان در انتخاب محصول کمک کنید.';
  }

  async getWelcomeMessage(): Promise<string> {
    const msg = await hyperConfig.get('ai_chat_welcome');
    return (msg as string) || 'سلام! چطور می‌تونم کمکتون کنم؟';
  }

  getSuggestions(): string[] {
    return [
      'محصولات پیشنهادی',
      'شرایط ارسال رایگان',
      'کد تخفیف دارید؟',
      'قوانین مرجوعی',
    ];
  }

  async sendMessage(
    sessionId: string,
    content: string,
    userId?: string
  ): Promise<{ role: string; content: string }> {
    const enabled = await this.isEnabled();
    if (!enabled) {
      return { role: 'assistant', content: 'چت هوش مصنوعی در حال حاضر غیرفعال است.' };
    }

    await prisma.chatMessage.create({
      data: { sessionId, userId, role: 'user', content },
    });

    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const response = await this.generateResponse(content, history);

    await prisma.chatMessage.create({
      data: { sessionId, role: 'assistant', content: response },
    });

    return { role: 'assistant', content: response };
  }

  async getHistory(sessionId: string) {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  private async buildSystemPrompt(): Promise<string> {
    const basePrompt = await this.getPrompt();
    const knowledge = await buildChatKnowledgeContext();

    return `${basePrompt}

═══ پایگاه دانش فروشگاه نکال (فقط از این اطلاعات استفاده کنید) ═══
${knowledge}

═══ قوانین پاسخ‌دهی ═══
- همیشه به فارسی و با لحن گرم، حرفه‌ای و مختصر پاسخ دهید.
- فقط بر اساس اطلاعات بالا پاسخ دهید؛ اگر مطمئن نیستید صادقانه بگویید و تماس با پشتیبانی را پیشنهاد دهید.
- قیمت‌ها به تومان هستند.
- برای محصولات لینک نسبی بدهید: /products/{slug}
- برای مقالات لینک بدهید: /blog/{slug}
- وضعیت موجودی را از فیلد موجود/ناموجود بخوانید.
- کدهای تخفیف را دقیقاً همان‌طور که در بخش کدهای تخفیف آمده اعلام کنید.
- درباره ارسال، مرجوعی و تماس فقط اعداد و شرایط ثبت‌شده در بالا را بگویید.`;
  }

  private async generateResponse(
    userMessage: string,
    history: { role: string; content: string }[]
  ): Promise<string> {
    const apiKey = await hyperConfig.get('openai_api_key');
    const systemPrompt = await this.buildSystemPrompt();

    if (apiKey && typeof apiKey === 'string' && apiKey.length > 0) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.map((h) => ({ role: h.role, content: h.content })),
            ],
            max_tokens: 800,
            temperature: 0.45,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const answer = data.choices?.[0]?.message?.content?.trim();
          if (answer) return answer;
        }
      } catch (error) {
        console.error('[AI Chat] OpenAI error:', error);
      }
    }

    return generateKnowledgeBasedResponse(userMessage);
  }
}

export const aiChatService = new AIChatService();
