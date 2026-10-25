import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { submitContact } from '../lib/api';
import {
  advanceConversation,
  buildContactPayload,
  createConversation,
  type ChatStage,
  type ConversationState,
} from '../lib/chat-assistant';

type ChatMessage = { id: number; role: 'assistant' | 'visitor'; text: string };
type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

const stageLabels: Record<ChatStage, string> = {
  goal: 'Project type',
  restaurant: 'Restaurant',
  website: 'Current site',
  priority: 'Main goal',
  budget: 'Investment',
  timeline: 'Timeline',
  name: 'Contact',
  email: 'Email',
  consultation: 'Consultation',
  complete: 'Ready',
};

const stageNumber: Record<ChatStage, number> = {
  goal: 1,
  restaurant: 2,
  website: 3,
  priority: 4,
  budget: 5,
  timeline: 6,
  name: 7,
  email: 8,
  consultation: 9,
  complete: 9,
};

function initialMessages(state: ConversationState): ChatMessage[] {
  return [{ id: 1, role: 'assistant', text: state.reply }];
}

function inputMeta(stage: ChatStage) {
  if (stage === 'restaurant')
    return { label: 'Restaurant name', placeholder: 'Your restaurant name', type: 'text' };
  if (stage === 'website')
    return { label: 'Current website', placeholder: 'restaurant.com', type: 'text' };
  if (stage === 'name')
    return { label: 'Your name', placeholder: 'Name for follow-up', type: 'text' };
  if (stage === 'email')
    return { label: 'Email address', placeholder: 'you@restaurant.com', type: 'email' };
  if (stage === 'consultation')
    return {
      label: 'Preferred consultation time',
      placeholder: 'Tuesday, 2 PM Pacific',
      type: 'text',
    };
  return { label: 'Your answer', placeholder: 'Type your answer', type: 'text' };
}

export function SiteAssistant() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(() => createConversation(pathname));
  const [messages, setMessages] = useState(() => initialMessages(conversation));
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(2);
  const submitting = useRef(false);

  function closeAssistant() {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 50);
  }

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => panelRef.current?.focus(), 50);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAssistant();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (messages.length > 1) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
    if (conversation.options.length === 0 && conversation.stage !== 'complete') {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [conversation, messages, open, sendStatus]);

  async function sendLead(next: ConversationState) {
    if (submitting.current) return;
    submitting.current = true;
    setSendStatus('sending');
    try {
      const sent = await submitContact(buildContactPayload(next.lead));
      setSendStatus(sent ? 'sent' : 'error');
    } catch {
      setSendStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  function answer(rawValue: string) {
    if (sendStatus === 'sending' || conversation.stage === 'complete') return;
    const value = rawValue.trim();
    const result = advanceConversation(conversation, value);
    if (result.error) {
      setError(result.error);
      return;
    }

    setError('');
    setInput('');
    const next = result.state;
    setMessages((current) => [
      ...current,
      { id: messageId.current++, role: 'visitor', text: value },
      { id: messageId.current++, role: 'assistant', text: next.reply },
    ]);
    setConversation(next);
    if (next.stage === 'complete') void sendLead(next);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    answer(input);
  }

  function restart() {
    if (submitting.current) return;
    const next = createConversation(pathname);
    setConversation(next);
    setMessages(initialMessages(next));
    messageId.current = 2;
    setInput('');
    setError('');
    setSendStatus('idle');
  }

  const meta = inputMeta(conversation.stage);
  const progress = `${Math.round((stageNumber[conversation.stage] / 9) * 100)}%`;

  return (
    <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      {open ? (
        <section
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label="KM automated project assistant"
          className="flex h-[min(620px,calc(100dvh-2rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden border border-[var(--km-border-strong)] bg-[var(--km-surface)] shadow-[0_28px_90px_rgba(19,17,15,0.28)] sm:h-[min(560px,calc(100dvh-3rem))]"
        >
          <header className="border-b km-border-soft bg-[var(--km-surface-muted)] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center bg-brand text-sm font-black text-white">
                  KM
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[var(--km-surface-muted)] bg-emerald-500" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-black uppercase tracking-[0.08em] km-text-strong">
                    Project assistant
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] km-text-muted">
                    Automated · sends to our team
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAssistant}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border km-border-soft km-text-strong transition hover:text-brand"
                aria-label="Close project assistant"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] km-text-muted">
              <span>{stageLabels[conversation.stage]}</span>
              <span>{stageNumber[conversation.stage]} / 9</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden bg-[var(--km-border)]">
              <div
                className="h-full bg-brand transition-[width] duration-500"
                style={{ width: progress }}
              />
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${message.role === 'visitor' ? 'bg-brand text-white' : 'border km-border-soft bg-[var(--km-surface-muted)] km-text-strong'}`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {sendStatus === 'sending' ? (
              <p className="text-center text-xs km-text-soft">Sending your brief securely…</p>
            ) : null}
            {sendStatus === 'sent' ? (
              <div className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                <strong>Brief sent.</strong> The KM team will follow up by email.
              </div>
            ) : null}
            {sendStatus === 'error' ? (
              <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
                We could not send the brief. Please use the contact page or email
                hello@kmwebdesign.xyz.
              </div>
            ) : null}
          </div>

          <footer className="border-t km-border-soft bg-[var(--km-surface-muted)] p-4">
            {conversation.options.length > 0 && conversation.stage !== 'complete' ? (
              <div className="mb-3 grid grid-cols-2 gap-2">
                {conversation.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answer(option)}
                    className="min-h-11 border km-border-strong bg-[var(--km-surface)] px-3 py-2.5 text-left text-xs font-semibold leading-4 km-text-strong transition hover:border-brand hover:text-brand"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
            {conversation.stage !== 'complete' ? (
              <form onSubmit={submit} className="flex items-end gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">{meta.label}</span>
                  <input
                    ref={inputRef}
                    type={meta.type}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={meta.placeholder}
                    maxLength={500}
                    className="w-full border km-border-strong bg-[var(--km-surface)] px-3 py-3 text-sm km-text-strong outline-none placeholder:text-[var(--km-text)] focus:border-brand"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!input.trim() || sendStatus === 'sending'}
                  className="inline-flex h-11 items-center justify-center bg-brand px-4 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send answer"
                >
                  Send
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={restart}
                disabled={sendStatus === 'sending'}
                className="km-button km-button-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start another request
              </button>
            )}
            {error ? (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <p className="mt-3 text-[11px] leading-4 km-text-muted">
              No live AI or confirmed calendar availability. Your answers are sent only when the
              brief is complete.
            </p>
          </footer>
        </section>
      ) : (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 border border-brand/30 bg-[var(--km-surface)] px-4 py-3 shadow-[0_16px_44px_rgba(19,17,15,0.22)] transition hover:-translate-y-1 hover:border-brand"
          aria-label="Open KM automated project assistant"
        >
          <span className="relative inline-flex h-10 w-10 items-center justify-center bg-brand text-xs font-black text-white">
            KM
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[var(--km-surface)] bg-emerald-500" />
          </span>
          <span className="text-left">
            <span className="block text-[9px] font-black uppercase tracking-[0.16em] km-text-soft">
              Need a restaurant site?
            </span>
            <span className="mt-1 block text-sm font-bold km-text-strong group-hover:text-brand">
              Plan your project
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
