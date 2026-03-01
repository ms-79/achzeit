import { useState, useRef, useEffect, useCallback } from 'react';

import { MessageCircle, ArrowUp, Mic, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import { useGuestGuideLocale } from './GuestGuideLanguageContext';
import { translations } from './translations';

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guest-guide-chat`;

const QUICK_BUTTONS_KEYS = ['wifi', 'zugang', 'checkout'] as const;
const QUICK_BUTTONS_MAP: Record<typeof QUICK_BUTTONS_KEYS[number], keyof typeof translations.chatSuggestions> = {
  wifi: 'wifi',
  zugang: 'fireplace', // we'll use actual translations below
  checkout: 'supermarket',
};

const ESCALATION_KEYWORDS = ['problem', 'geht nicht', 'hilfe', 'notfall', 'help', 'emergency', 'broken', 'not working', 'ayuda', 'emergencia', 'aiuto', 'aide', 'urgence', 'noodgeval'];

export interface ChatGuestData {
  wifiPassword: string;
  boxCode: string;
  guestName: string;
  checkin?: string;
  checkout?: string;
}

interface GuestGuideChatbotProps {
  guestData: ChatGuestData;
}

const GuestGuideChatbot: React.FC<GuestGuideChatbotProps> = ({ guestData }) => {
  const { locale } = useGuestGuideLocale();
  const t = translations;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const autoOpenRef = useRef(false);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, []);

  // Auto-open on first visit with greeting
  useEffect(() => {
    if (autoOpenRef.current) return;
    autoOpenRef.current = true;
    const visited = sessionStorage.getItem('achzeit-concierge-opened');
    if (!visited) {
      const timer = setTimeout(() => {
        setOpen(true);
        setHasOpened(true);
        setShowPulse(false);
        sessionStorage.setItem('achzeit-concierge-opened', '1');
        // Add greeting message
        setMessages([{ role: 'assistant', content: t.conciergeGreeting[locale] }]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [locale, t]);

  useEffect(() => {
    if (open && textareaRef.current) textareaRef.current.focus();
    if (open) {
      setShowPulse(false);
      setHasOpened(true);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }, [input]);

  // Check for escalation keywords in user message
  const shouldShowEscalation = (text: string) => {
    const lower = text.toLowerCase();
    return ESCALATION_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    // Check for escalation
    const needsEscalation = shouldShowEscalation(text);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: {
            wifiPassword: guestData.wifiPassword,
            boxCode: guestData.boxCode,
            guestName: guestData.guestName,
          },
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              const snapshot = assistantSoFar;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: snapshot } : m));
                }
                return [...prev, { role: 'assistant', content: snapshot }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Append WhatsApp escalation if keywords detected
      if (needsEscalation) {
        const escalationText = `\n\n---\n\n${t.whatsappEscalation[locale]}\n\n[${t.whatsappOpen[locale]}](https://wa.me/4915679656368)`;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: m.content + escalationText } : m));
          }
          return prev;
        });
      }
    } catch (e) {
      console.error('Chat error:', e);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t.chatError[locale] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  // Quick button labels for the greeting
  const quickButtons = [
    { label: t.navWlan[locale], query: t.chatSuggestions.wifi[locale] },
    { label: t.navZugang[locale], query: t.chatSuggestions.fireplace[locale].includes('Kamin') ? `Wie komme ich ins Haus?` : `How do I access the house?` },
    { label: t.navCheckout[locale], query: locale === 'de' ? 'Was muss ich beim Check-out beachten?' : locale === 'en' ? 'What should I know about check-out?' : locale === 'es' ? '¿Qué debo saber sobre el check-out?' : locale === 'it' ? 'Cosa devo sapere sul check-out?' : locale === 'fr' ? 'Que dois-je savoir sur le check-out ?' : 'Wat moet ik weten over de check-out?' },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-background text-foreground border-2 border-border/60 hover:scale-105 shadow-[0_4px_24px_-2px_rgba(255,255,255,0.25),0_2px_12px_-2px_rgba(0,0,0,0.3)] ${
          showPulse ? 'animate-[pulse_2s_ease-in-out_3]' : ''
        }`}
        aria-label={t.chatOpenLabel[locale]}
      >
        <MessageCircle size={22} />
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[540px] max-h-[80dvh] p-0 gap-0 flex flex-col overflow-hidden border-border/50 rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">ACHZEIT Concierge</DialogTitle>

          {/* Header – minimal */}
          <div className="px-5 py-3.5 border-b border-border/40 shrink-0 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{t.chatTitle[locale]}</p>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-[240px]">
            <div className="max-w-[480px] mx-auto px-4 py-5 space-y-5">
              {messages.length === 0 && (
                <div className="pt-6 pb-2 space-y-5">
                  <p className="text-base text-muted-foreground text-center">{t.chatWelcome[locale]}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(['sauna', 'supermarket', 'fireplace', 'wifi'] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => send(t.chatSuggestions[key][locale])}
                        className="text-xs text-muted-foreground hover:text-foreground px-3.5 py-2 rounded-full border border-border/60 hover:border-border hover:bg-muted/50 transition-all"
                      >
                        {t.chatSuggestions[key][locale]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show quick buttons after greeting (first auto-open) */}
              {messages.length === 1 && messages[0].role === 'assistant' && (
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {quickButtons.map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => send(btn.query)}
                      className="text-xs font-medium text-foreground/80 hover:text-foreground px-4 py-2 rounded-full border border-border hover:border-foreground/30 hover:bg-muted/50 transition-all"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-muted rounded-3xl rounded-br-lg px-4 py-2.5 text-sm text-foreground whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[0.9rem] text-foreground leading-relaxed">
                      <div className="prose max-w-none prose-p:my-1.5 prose-p:text-[0.9rem] prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:text-[0.9rem] prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-strong:text-foreground prose-headings:text-foreground prose-headings:font-body [&_h3]:!text-lg [&_h3]:!font-semibold [&_h3]:!mt-5 [&_h3]:!mb-2 [&_h4]:!text-base [&_h4]:!font-semibold [&_h4]:!mt-4 [&_h4]:!mb-1.5">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          </div>

          {/* Input bar – ChatGPT style */}
          <div className="p-3 shrink-0">
            <div className="flex items-end gap-2 bg-muted rounded-2xl px-4 py-2.5 border border-border/40 focus-within:border-border/80 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.chatPlaceholder[locale]}
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 resize-none leading-relaxed max-h-[150px]"
              />
              {/* Mic button – shown when input is empty */}
              {!input.trim() && (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 mb-0.5 ${
                    isListening
                      ? 'bg-destructive text-destructive-foreground animate-pulse'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={isListening ? t.micStop[locale] : t.micStart[locale]}
                >
                  <Mic size={16} />
                </button>
              )}
              {/* Send button – shown when there's text */}
              {input.trim() && (
                <button
                  type="button"
                  onClick={() => { stopListening(); send(input); }}
                  disabled={isLoading}
                  className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-20 transition-opacity shrink-0 mb-0.5"
                >
                  <ArrowUp size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestGuideChatbot;
