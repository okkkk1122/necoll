'use client';

import { useConfig } from '@/lib/config-context';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { getClientAPI } from '@/lib/api';
import Link from 'next/link';

interface Message {
  role: string;
  content: string;
}

const SESSION_KEY = 'necoll_chat_session';

function renderMessageContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\/[a-z0-9\-/?=&%]+)/gi);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('/') && part.length > 1 && !part.includes(' ')) {
      return (
        <Link key={i} href={part} className="text-[var(--color-blue-deep)] underline underline-offset-2 hover:opacity-80">
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatWidget() {
  const config = useConfig();
  const enabled = config.ai_chat_enabled;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcome, setWelcome] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enabled) {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setSessionId(saved);

      getClientAPI()
        .get<{ enabled: boolean; welcome: string; suggestions?: string[] }>('/chat/status')
        .then((data) => {
          setWelcome(data.welcome);
          setSuggestions(data.suggestions || []);
        });
    }
  }, [enabled]);

  useEffect(() => {
    if (sessionId) sessionStorage.setItem(SESSION_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const userMsg = (text ?? input).trim();
      if (!userMsg || loading) return;
      setInput('');
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
      setLoading(true);
      try {
        const api = getClientAPI();
        const res = await api.post<{ sessionId: string; role: string; content: string }>(
          '/chat/message',
          { content: userMsg, sessionId }
        );
        if (res.sessionId) setSessionId(res.sessionId);
        setMessages((prev) => [...prev, { role: 'assistant', content: res.content }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, sessionId]
  );

  if (!enabled) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="chat-widget-fab fixed z-40 flex items-center justify-center text-white transition-opacity hover:opacity-90"
        style={{
          background: 'var(--color-blue-deep)',
          borderRadius: 'var(--border-radius-lg)',
          width: '3.25rem',
          height: '3.25rem',
        }}
        aria-label="چت"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="chat-widget-panel fixed z-40 rounded-xl flex flex-col overflow-hidden border border-[var(--color-border-light)] bg-[var(--color-surface)] shadow-md">
          <div
            className="px-4 py-3 text-white flex items-center gap-3 shrink-0"
            style={{ background: 'var(--color-blue-deep)' }}
          >
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-semibold text-sm">دستیار نکال</p>
              <p className="text-[10px] text-white/75">پاسخ‌دهی هوشمند</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors lg:hidden"
              aria-label="بستن"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-[var(--color-background)] min-h-0">
            {messages.length === 0 && welcome && (
              <div className="chat-bubble-assistant text-sm leading-relaxed">{welcome}</div>
            )}

            {messages.length === 0 && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-2 rounded-full border border-[var(--color-blue-soft)] bg-white/80 text-[var(--color-blue-deep)] hover:bg-[var(--color-blue-pale)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-4 py-3 rounded-2xl max-w-[92%] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'chat-bubble-user mr-auto'
                    : 'chat-bubble-assistant ml-auto'
                }`}
              >
                {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-assistant flex items-center gap-1.5 py-3">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-[var(--color-border-light)] bg-white/95 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="سوال خود را بپرسید..."
              className="input-modern flex-1 !py-2.5 !rounded-xl min-w-0"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="p-2.5 sm:p-3 rounded-lg text-white disabled:opacity-50 shrink-0"
              style={{ background: 'var(--color-blue-deep)' }}
              aria-label="ارسال"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
