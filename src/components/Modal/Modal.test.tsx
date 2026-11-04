import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Modal } from './Modal';
import { Button } from '../Button';
import { TextField } from '../TextField';

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Archive matter</Button>
      <Modal
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        title="Archive this matter?"
        description="It moves to the archive and stops sending reminders."
        footer={<Button onClick={() => setOpen(false)}>Archive</Button>}
      >
        <TextField label="Reason" />
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('opens as a labelled, described dialog', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Archive matter' }));

    const dialog = screen.getByRole('dialog', { name: 'Archive this matter?' });
    expect(dialog).toHaveAccessibleDescription('It moves to the archive and stops sending reminders.');
  });

  it('moves focus to the first field in the body', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Archive matter' }));
    expect(screen.getByRole('textbox', { name: 'Reason' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the button that opened it', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const trigger = screen.getByRole('button', { name: 'Archive matter' });

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Archive matter' }));
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Archive matter' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
