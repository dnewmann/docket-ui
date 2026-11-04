import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DeskBooking } from './DeskBooking';

const desk = (name: RegExp) => screen.getByRole('button', { name });

describe('Desk booking (integration)', () => {
  it('describes every desk with its state for screen readers', () => {
    render(<DeskBooking />);
    expect(desk(/^Desk A1, Available/)).toBeInTheDocument();
    expect(desk(/^Desk A2, Booked by Sam Ortiz/)).toBeInTheDocument();
  });

  it('books an available desk with the keyboard and lists it under My bookings', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);

    desk(/^Desk A1/).focus();
    await user.keyboard('{Enter}');
    expect(desk(/^Desk A1/)).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Book Desk A1' }));

    expect(screen.getByRole('status')).toHaveTextContent('Booked Desk A1 for Wed, Nov 4.');
    expect(desk(/^Desk A1, Your booking/)).toBeInTheDocument();
    const mine = screen.getByRole('region', { name: 'My bookings' });
    expect(within(mine).getByText('Desk A1')).toBeInTheDocument();
  });

  it('does not offer booking for a desk someone else has', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    await user.click(desk(/^Desk A2/));
    expect(screen.getByText('Booked by Sam Ortiz. Try another desk or day.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Book Desk A2/ })).not.toBeInTheDocument();
  });

  it('enforces one desk per person per day', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    await user.click(desk(/^Desk A1/));
    await user.click(screen.getByRole('button', { name: 'Book Desk A1' }));
    await user.click(desk(/^Desk B2/));
    await user.click(screen.getByRole('button', { name: 'Book Desk B2' }));
    expect(screen.getByRole('status')).toHaveTextContent('You already have Desk A1 on Wed, Nov 4. Cancel it first');
  });

  it('cancels a booking through a confirm dialog and frees the desk', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Day' }), '2026-11-09');
    expect(desk(/^Desk B2, Your booking/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel Desk B2 on Mon, Nov 9' }));
    const dialog = screen.getByRole('dialog', { name: 'Cancel this booking?' });
    await user.click(within(dialog).getByRole('button', { name: 'Cancel booking' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(desk(/^Desk B2, Available/)).toBeInTheDocument();
    expect(screen.getByText('No upcoming bookings.')).toBeInTheDocument();
  });

  it('keeps the booking when the user backs out of cancelling', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    await user.click(screen.getByRole('button', { name: 'Cancel Desk B2 on Mon, Nov 9' }));
    await user.click(screen.getByRole('button', { name: 'Keep booking' }));
    expect(screen.getByRole('region', { name: 'My bookings' })).toHaveTextContent('Desk B2');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DeskBooking />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Desk booking onboarding tour', () => {
  it('walks through each section, highlights it, and returns focus to the help button', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    const help = screen.getByRole('button', { name: 'How it works' });
    await user.click(help);

    let tip = screen.getByRole('dialog', { name: 'Pick a day' });
    expect(tip).toHaveFocus();
    expect(tip).toHaveTextContent('Step 1 of 4');
    expect(document.querySelector('[data-tour="day"]')).toHaveAttribute('data-tour-active');

    await user.click(within(tip).getByRole('button', { name: 'Next' }));
    tip = screen.getByRole('dialog', { name: 'Choose a desk' });
    expect(document.querySelector('[data-tour="day"]')).not.toHaveAttribute('data-tour-active');
    expect(document.querySelector('[data-tour="map"]')).toHaveAttribute('data-tour-active');

    await user.click(within(tip).getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('dialog', { name: 'Pick a day' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('[data-tour-active]')).toBeNull();
    expect(help).toHaveFocus();
  });

  it('ends with Done on the last step', async () => {
    const user = userEvent.setup();
    render(<DeskBooking />);
    await user.click(screen.getByRole('button', { name: 'How it works' }));
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('dialog', { name: 'Manage your bookings' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
