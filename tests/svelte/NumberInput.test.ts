import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import NumberInput from '../../src/svelte/components/NumberInput.svelte';
import TextInput from '../../src/svelte/components/TextInput.svelte';

describe('NumberInput', () => {
  it('shows the value and the unit and passes the limits to the input', () => {
    const { getByRole, getByText } = render(NumberInput, {
      value: 12,
      unit: 'px',
      min: 0,
      max: 64,
      step: 'any',
      ariaLabel: 'Width',
    });
    const input = getByRole('spinbutton', { name: 'Width' }) as HTMLInputElement;
    expect(input.value).toBe('12');
    expect(input.min).toBe('0');
    expect(input.max).toBe('64');
    expect(input.step).toBe('any');
    expect(getByText('px')).toBeTruthy();
  });

  it('reports input and a committed change', async () => {
    const oninput = vi.fn();
    const onchange = vi.fn();
    const { getByRole } = render(NumberInput, { value: 1, oninput, onchange, ariaLabel: 'N' });
    const input = getByRole('spinbutton') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '5' } });
    expect(oninput).toHaveBeenCalledOnce();
    await fireEvent.change(input, { target: { value: '5' } });
    expect(onchange).toHaveBeenCalledOnce();
  });

  it('is empty for null, marks an error and takes one of the fixed widths', () => {
    const { getByRole, container } = render(NumberInput, {
      value: null,
      error: true,
      width: '8rem',
      ariaLabel: 'N',
    });
    const input = getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect((container.querySelector('label') as HTMLElement).style.width).toBe('8rem');
  });

  it('is as wide as its digits, or its placeholder when longer, and digits win over width', () => {
    const short = render(NumberInput, { value: 12.5, digits: 4, width: '6rem', ariaLabel: 'A' });
    const a = short.container.querySelector('label') as HTMLElement;
    expect(a.getAttribute('data-digits')).toBe('4');
    expect(a.style.getPropertyValue('--kata-number-digits')).toBe('4');
    expect(a.style.width).toBe('');
    const long = render(NumberInput, {
      value: null,
      digits: 2,
      placeholder: 'Auto size',
      ariaLabel: 'B',
    });
    const b = long.container.querySelector('label') as HTMLElement;
    expect(b.getAttribute('data-digits')).toBe('2');
    expect(b.style.getPropertyValue('--kata-number-digits')).toBe('9');
  });
});

describe('TextInput', () => {
  it('copies the typed value and lists the suggestions', async () => {
    const oninput = vi.fn();
    const { getByRole, container } = render(TextInput, {
      'aria-label': 'Name',
      suggestions: ['One', 'Two'],
      oninput,
    });
    const input = getByRole('combobox', { name: 'Name' }) as HTMLInputElement;
    const list = container.querySelector('datalist');
    expect(input.getAttribute('list')).toBe(list?.id);
    expect(list?.querySelectorAll('option').length).toBe(2);
    await fireEvent.input(input, { target: { value: 'Three' } });
    expect(oninput).toHaveBeenCalledOnce();
  });
});
