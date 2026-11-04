import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button, Modal, TextField } from '../index';
import { Field, fieldStyles } from '../components/Field';
import styles from './AssistantChat.module.css';

/*
 * AI assistant sample: saved chats, a saved prompt library and a chat window.
 * Replies are fixed. Nothing is sent anywhere; this shows the UI states
 * (thinking, streaming, saved, pinned) built only from Docket UI.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Follow-up suggestions shown as buttons under an assistant reply. */
  suggestions?: string[];
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  messages: ChatMessage[];
}

export interface SavedPrompt {
  id: string;
  title: string;
  text: string;
}

export const GREETING = 'Hello, what can you do?';
const CAPABILITIES = ['Write an email', 'Summarize text'];

/** Fixed replies. Text only: replies render as React text nodes, never as HTML. */
export function replyTo(input: string): Omit<ChatMessage, 'id' | 'role'> {
  if (/e-?mail/i.test(input)) {
    return {
      text: 'I can draft that email for you. In the full tool, the draft would stream in right here for you to edit and copy. This sample stops at fixed replies.',
    };
  }
  if (/summar/i.test(input)) {
    return {
      text: 'Paste the text you want summarized and I will pull out the key points and next steps. This sample stops at fixed replies, so nothing is summarized here.',
    };
  }
  return { text: 'Hi! I can help you with:', suggestions: CAPABILITIES };
}

let seq = 0;
const nextId = (prefix: string) => `${prefix}${Date.now().toString(36)}${(seq++).toString(36)}`;

const seedChats: Chat[] = [
  {
    id: 'c1',
    title: 'Client kickoff follow-up',
    pinned: true,
    messages: [
      { id: 'm1', role: 'user', text: 'Write an email following up on the kickoff meeting' },
      { id: 'm2', role: 'assistant', ...replyTo('email') },
    ],
  },
  {
    id: 'c2',
    title: 'Summarize meeting notes',
    pinned: false,
    messages: [
      { id: 'm3', role: 'user', text: 'Summarize text from my meeting notes' },
      { id: 'm4', role: 'assistant', ...replyTo('summarize') },
    ],
  },
];

const seedPrompts: SavedPrompt[] = [
  {
    id: 'p1',
    title: 'Client follow-up email',
    text: 'Write a short, friendly email to a client after our kickoff meeting. Recap the next steps and ask them to confirm the timeline.',
  },
];

type Tab = 'chats' | 'prompts';

interface Pending {
  chatId: string;
  reply: Omit<ChatMessage, 'id' | 'role'>;
  phase: 'thinking' | 'streaming';
  shown: number;
}

export interface AssistantChatProps {
  initialChats?: Chat[];
  initialPrompts?: SavedPrompt[];
  /** Delay before the reply starts. Set both delays to 0 for instant replies (tests). */
  thinkMs?: number;
  /** Delay between streamed chunks. */
  chunkMs?: number;
}

export function AssistantChat({
  initialChats = seedChats,
  initialPrompts = seedPrompts,
  thinkMs = 700,
  chunkMs = 25,
}: AssistantChatProps) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [prompts, setPrompts] = useState<SavedPrompt[]>(initialPrompts);
  const [activeId, setActiveId] = useState<string | null>(null); // null = new, unsaved chat
  const [tab, setTab] = useState<Tab>('chats');
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<Pending | null>(null);
  const [notice, setNotice] = useState('');
  const [promptModal, setPromptModal] = useState(false);

  const composerRef = useRef<HTMLTextAreaElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const skipGreeting = useRef(false);
  const uid = useId();

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const active = chats.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];
  const busy = pending !== null;
  const showPending = pending && pending.chatId === activeId;

  useEffect(() => {
    logEndRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages.length, pending?.shown, pending?.phase]);

  function addMessage(chatId: string, message: ChatMessage) {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, message] } : c)));
  }

  function respond(chatId: string, input: string) {
    const reply = replyTo(input);
    const finish = () => {
      setPending(null);
      addMessage(chatId, { id: nextId('m'), role: 'assistant', ...reply });
    };
    if (thinkMs === 0 && chunkMs === 0) {
      finish();
      return;
    }
    setPending({ chatId, reply, phase: 'thinking', shown: 0 });
    // Stream a few characters at a time, the way tokens arrive from a model.
    const step = (shown: number) => {
      if (shown >= reply.text.length) {
        finish();
        return;
      }
      setPending({ chatId, reply, phase: 'streaming', shown });
      timers.current.push(window.setTimeout(() => step(shown + 3), chunkMs));
    };
    timers.current.push(window.setTimeout(() => step(1), thinkMs));
  }

  function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    const message: ChatMessage = { id: nextId('m'), role: 'user', text: value };
    let chatId = activeId;
    if (!chatId) {
      // The first message saves the chat, titled from what was asked.
      chatId = nextId('c');
      const title = value.length > 40 ? `${value.slice(0, 38).trimEnd()}…` : value;
      setChats((prev) => [{ id: chatId!, title, pinned: false, messages: [message] }, ...prev]);
      setActiveId(chatId);
      setNotice(`Chat saved as "${title}".`);
    } else {
      addMessage(chatId, message);
    }
    setDraft('');
    respond(chatId, value);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(draft);
  }

  function onComposerKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send(draft);
    }
  }

  function onComposerFocus() {
    // Fixed input for the sample: an empty new chat starts with the greeting, selected so typing replaces it.
    if (skipGreeting.current) {
      skipGreeting.current = false;
      return;
    }
    if (!draft && messages.length === 0) {
      setDraft(GREETING);
      requestAnimationFrame(() => composerRef.current?.select());
    }
  }

  function newChat() {
    setActiveId(null);
    setDraft('');
    setNotice('');
    setTab('chats');
    composerRef.current?.focus();
  }

  function applyPrompt(prompt: SavedPrompt) {
    setActiveId(null);
    setDraft(prompt.text);
    setNotice(`"${prompt.title}" added to a new chat. Edit it or press Send.`);
    skipGreeting.current = true;
    composerRef.current?.focus();
  }

  function togglePin(chat: Chat) {
    setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, pinned: !c.pinned } : c)));
  }

  const pinned = chats.filter((c) => c.pinned);
  const recent = chats.filter((c) => !c.pinned);
  const tabs: { id: Tab; label: string }[] = [
    { id: 'chats', label: 'Chats' },
    { id: 'prompts', label: 'Saved prompts' },
  ];

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next: Tab = tab === 'chats' ? 'prompts' : 'chats';
    setTab(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  const chatGroup = (label: string, list: Chat[]) =>
    list.length > 0 && (
      <div className={styles.group}>
        <h3 className={styles.groupLabel}>{label}</h3>
        <ul className={styles.chatList}>
          {list.map((chat) => (
            <li key={chat.id} className={[styles.chatItem, chat.id === activeId && styles.current].filter(Boolean).join(' ')}>
              <button
                type="button"
                className={styles.chatButton}
                aria-current={chat.id === activeId ? 'true' : undefined}
                onClick={() => {
                  setActiveId(chat.id);
                  setNotice('');
                }}
              >
                {chat.title}
              </button>
              <button
                type="button"
                className={styles.pin}
                aria-pressed={chat.pinned}
                aria-label={`Pin ${chat.title}`}
                onClick={() => togglePin(chat)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar} aria-label="Chats and prompts">
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
            </svg>
          </span>
          <span className={styles.brandName}>Docket AI</span>
        </div>
        <Button
          fullWidth
          onClick={newChat}
          startIcon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          New chat
        </Button>

        <div role="tablist" aria-label="Sidebar" className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${uid}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              className={styles.tab}
              onClick={() => setTab(t.id)}
              onKeyDown={onTabKey}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          id={`${uid}-panel-chats`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-chats`}
          hidden={tab !== 'chats'}
          className={styles.panel}
        >
          {chatGroup('Pinned', pinned)}
          {chatGroup('Recent', recent)}
          {chats.length === 0 && <p className={styles.empty}>No saved chats yet.</p>}
        </div>

        <div
          id={`${uid}-panel-prompts`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-prompts`}
          hidden={tab !== 'prompts'}
          className={styles.panel}
        >
          <ul className={styles.promptList}>
            {prompts.map((p) => (
              <li key={p.id} className={styles.promptCard}>
                <h3 className={styles.promptTitle}>{p.title}</h3>
                <p className={styles.promptText}>{p.text}</p>
                <Button size="sm" variant="secondary" aria-label={`Use prompt: ${p.title}`} onClick={() => applyPrompt(p)}>
                  Use prompt
                </Button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" fullWidth onClick={() => setPromptModal(true)}>
            + New prompt
          </Button>
        </div>
      </aside>

      <section className={styles.main} aria-labelledby={`${uid}-title`}>
        <header className={styles.mainHeader}>
          <h2 id={`${uid}-title`} className={styles.h2}>
            {active ? active.title : 'New chat'}
          </h2>
          <span className={styles.badge}>Sample · fixed replies</span>
        </header>

        {/* aria-busy holds announcements until a streamed reply is complete, so it is read once, not letter by letter. */}
        <div className={styles.log} role="log" aria-label="Conversation" aria-live="polite" aria-busy={showPending ? true : undefined}>
          {messages.length === 0 && !showPending && (
            <div className={styles.welcome}>
              <span className={[styles.mark, styles.markLg].join(' ')} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
                </svg>
              </span>
              <p className={styles.welcomeTitle}>How can I help today?</p>
              <p className={styles.welcomeText}>Click the message box to start, or use a saved prompt.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={m.id} className={[styles.row, styles[m.role]].join(' ')}>
              <div className={styles.bubble}>
                <span className={styles.srOnly}>{m.role === 'user' ? 'You said: ' : 'Docket AI said: '}</span>
                {m.text}
                {m.suggestions && (
                  <div className={styles.suggestions}>
                    {m.suggestions.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant="secondary"
                        disabled={busy || i !== messages.length - 1}
                        onClick={() => send(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {showPending && (
            <div className={[styles.row, styles.assistant].join(' ')}>
              <div className={styles.bubble}>
                {pending.phase === 'thinking' ? (
                  <span className={styles.thinking}>
                    <span className={styles.srOnly}>Docket AI is thinking</span>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </span>
                ) : (
                  <>
                    {pending.reply.text.slice(0, pending.shown)}
                    <span className={styles.caret} aria-hidden="true" />
                  </>
                )}
              </div>
            </div>
          )}
          <div ref={logEndRef} />
        </div>

        <form className={styles.composer} onSubmit={onSubmit}>
          <Field label="Message Docket AI" hideLabel>
            {(a11y) => (
              <textarea
                ref={composerRef}
                rows={2}
                className={[fieldStyles.control, styles.textarea].join(' ')}
                placeholder="Message Docket AI"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={onComposerFocus}
                onKeyDown={onComposerKey}
                {...a11y}
              />
            )}
          </Field>
          <Button type="submit" disabled={!draft.trim() || busy} loading={busy} loadingLabel="Replying">
            Send
          </Button>
        </form>
        <p className={styles.footnote}>
          <span role="status">{notice}</span> Sample only: nothing you type leaves this page.
        </p>
      </section>

      <NewPromptModal
        open={promptModal}
        onClose={() => setPromptModal(false)}
        onSave={(p) => {
          setPrompts((prev) => [...prev, p]);
          setPromptModal(false);
          setNotice(`Prompt "${p.title}" saved.`);
        }}
      />
    </div>
  );
}

function NewPromptModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (prompt: SavedPrompt) => void;
}) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<{ title?: string; text?: string }>({});
  const formId = useId();

  function close() {
    setTitle('');
    setText('');
    setErrors({});
    onClose();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      title: title.trim() ? undefined : 'Give the prompt a title.',
      text: text.trim() ? undefined : 'Write the prompt text.',
    };
    setErrors(next);
    if (next.title || next.text) {
      const field = event.currentTarget.querySelector<HTMLElement>(next.title ? 'input' : 'textarea');
      field?.focus();
      return;
    }
    onSave({ id: nextId('p'), title: title.trim(), text: text.trim() });
    setTitle('');
    setText('');
    setErrors({});
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="New saved prompt"
      description="Saved prompts appear in the sidebar so anyone can reuse them."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            Save prompt
          </Button>
        </>
      }
    >
      <form id={formId} noValidate onSubmit={submit} className={styles.modalForm}>
        <TextField label="Title" required value={title} error={errors.title} onChange={(e) => setTitle(e.target.value)} />
        <Field label="Prompt" required error={errors.text} hint="Write it the way you would ask a colleague.">
          {(a11y) => (
            <textarea
              rows={4}
              className={[fieldStyles.control, styles.textarea].join(' ')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              {...a11y}
            />
          )}
        </Field>
      </form>
    </Modal>
  );
}
