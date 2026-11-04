import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { AssistantChat, GREETING } from './AssistantChat';

const setup = () => {
  const user = userEvent.setup();
  render(<AssistantChat thinkMs={0} chunkMs={0} />);
  return { user, composer: screen.getByRole('textbox', { name: 'Message Docket AI' }) };
};

describe('AI assistant sample', () => {
  afterEach(() => vi.useRealTimers());

  it('fills the greeting when you click into an empty chat and answers with what it can do', async () => {
    const { user, composer } = setup();
    await user.click(composer);
    expect(composer).toHaveValue(GREETING);

    await user.click(screen.getByRole('button', { name: 'Send' }));
    const log = screen.getByRole('log', { name: 'Conversation' });
    expect(within(log).getByText(GREETING)).toBeInTheDocument();
    expect(within(log).getByText('Hi! I can help you with:')).toBeInTheDocument();
    expect(within(log).getByRole('button', { name: 'Write an email' })).toBeInTheDocument();
    expect(within(log).getByRole('button', { name: 'Summarize text' })).toBeInTheDocument();
  });

  it('saves a new chat on the first message and lists it under Recent', async () => {
    const { user, composer } = setup();
    await user.click(composer);
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading', { level: 2, name: GREETING })).toBeInTheDocument();
    const current = screen.getByRole('button', { name: GREETING });
    expect(current).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(`Chat saved as "${GREETING}".`);
  });

  it('gives a fixed reply for each suggestion', async () => {
    const { user, composer } = setup();
    await user.click(composer);
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: 'Write an email' }));
    expect(screen.getByText(/I can draft that email for you/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Write an email' })).toBeDisabled();
  });

  it('opens a saved chat and pins it', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Summarize meeting notes' }));
    expect(screen.getByText(/Paste the text you want summarized/)).toBeInTheDocument();
    const pin = screen.getByRole('button', { name: 'Pin Summarize meeting notes' });
    expect(pin).toHaveAttribute('aria-pressed', 'false');
    await user.click(pin);
    expect(screen.getByRole('button', { name: 'Pin Summarize meeting notes' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses the saved prompt in a new chat', async () => {
    const { user, composer } = setup();
    await user.click(screen.getByRole('tab', { name: 'Saved prompts' }));
    await user.click(screen.getByRole('button', { name: 'Use prompt: Client follow-up email' }));
    expect((composer as HTMLTextAreaElement).value).toMatch(/^Write a short, friendly email/);
    expect(composer).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText(/I can draft that email for you/)).toBeInTheDocument();
  });

  it('creates a new saved prompt and validates empty fields', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Saved prompts' }));
    await user.click(screen.getByRole('button', { name: '+ New prompt' }));
    const dialog = screen.getByRole('dialog', { name: 'New saved prompt' });

    await user.click(within(dialog).getByRole('button', { name: 'Save prompt' }));
    expect(within(dialog).getByText('Give the prompt a title.')).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: /Title/ })).toHaveFocus();

    await user.type(within(dialog).getByRole('textbox', { name: /Title/ }), 'Meeting summary');
    await user.type(within(dialog).getByRole('textbox', { name: /Prompt/ }), 'Summarize these notes into next steps.');
    await user.click(within(dialog).getByRole('button', { name: 'Save prompt' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use prompt: Meeting summary' })).toBeInTheDocument();
  });

  it('switches tabs with the arrow keys', async () => {
    const { user } = setup();
    screen.getByRole('tab', { name: 'Chats' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Saved prompts' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Saved prompts' })).toHaveAttribute('aria-selected', 'true');
  });

  it('shows thinking, then streams the reply while the log is busy', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<AssistantChat thinkMs={100} chunkMs={10} />);
    await user.click(screen.getByRole('textbox', { name: 'Message Docket AI' }));
    await user.keyboard('{Enter}');

    const log = screen.getByRole('log');
    expect(screen.getByText('Docket AI is thinking')).toBeInTheDocument();
    expect(log).toHaveAttribute('aria-busy', 'true');

    await act(async () => vi.advanceTimersByTime(2000));
    expect(log).not.toHaveAttribute('aria-busy');
    expect(screen.getByText('Hi! I can help you with:')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('has no axe violations', async () => {
    const { container } = render(<AssistantChat thinkMs={0} chunkMs={0} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
