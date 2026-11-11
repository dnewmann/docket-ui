import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Menu } from './Menu';

const setup = () => {
  const onRename = vi.fn();
  const onDelete = vi.fn();
  const { container } = render(
    <Menu
      label="Actions"
      items={[
        { id: 'rename', label: 'Rename', onSelect: onRename },
        { id: 'export', label: 'Export', onSelect: () => {}, disabled: true },
        { id: 'delete', label: 'Delete', onSelect: onDelete, danger: true },
      ]}
    />,
  );
  return { container, user: userEvent.setup(), onRename, onDelete, trigger: screen.getByRole('button', { name: 'Actions' }) };
};

describe('Menu', () => {
  it('opens with the keyboard, skips disabled items, selects, and returns focus', async () => {
    const { user, onDelete, trigger } = setup();
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape and on outside click', async () => {
    const { user, trigger } = setup();
    await user.click(trigger);
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('has no axe violations while open', async () => {
    const { container, user, trigger } = setup();
    await user.click(trigger);
    expect(await axe(container)).toHaveNoViolations();
  });
});
