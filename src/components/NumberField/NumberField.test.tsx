import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { NumberField, type NumberFieldProps } from './NumberField';

function Harness(props: Partial<NumberFieldProps> & { initial?: number | null; onChangeSpy?: (n: number | null) => void }) {
  const { initial = null, onChangeSpy, ...rest } = props;
  const [value, setValue] = useState<number | null>(initial);
  return (
    <NumberField
      label="Amount"
      value={value}
      onValueChange={(n) => {
        setValue(n);
        onChangeSpy?.(n);
      }}
      {...rest}
    />
  );
}

describe('NumberField', () => {
  it('formats currency at rest and shows plain digits while editing', async () => {
    const user = userEvent.setup();
    render(<Harness format="currency" initial={1234.5} />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input).toHaveValue('1,234.50');
    await user.click(input);
    expect(input).toHaveValue('1234.5');
  });

  it('parses typed input, including pasted commas and symbols, into a number', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness format="currency" onChangeSpy={spy} />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    await user.click(input);
    await user.paste('$5,000');
    expect(spy).toHaveBeenLastCalledWith(5000);
    await user.tab();
    expect(input).toHaveValue('5,000.00');
  });

  it('treats percent values as fractions', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness format="percent" initial={0.07} onChangeSpy={spy} />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input).toHaveValue('7');
    await user.clear(input);
    await user.type(input, '7.5');
    expect(spy).toHaveBeenLastCalledWith(0.075);
  });

  it('reports null for empty or invalid input', async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness initial={10} onChangeSpy={spy} />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    await user.clear(input);
    expect(spy).toHaveBeenLastCalledWith(null);
    await user.type(input, 'abc');
    expect(spy).toHaveBeenLastCalledWith(null);
  });

  it('wires hint and error text, and has no axe violations', async () => {
    const { container } = render(<Harness format="currency" error="Enter an amount" />);
    expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveAccessibleDescription('Enter an amount');
    expect(await axe(container)).toHaveNoViolations();
  });
});
