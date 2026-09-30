import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import NativeSelect from '../../src/svelte/components/NativeSelect.svelte';
import Segmented from '../../src/svelte/components/Segmented.svelte';
import Select from '../../src/svelte/components/Select.svelte';

const options = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date', description: 'The last change' },
  { value: 'size', label: 'Size' },
];

describe('Select', () => {
  it('shows the placeholder, then the chosen label', () => {
    const empty = render(Select, { options, placeholder: 'Sort by', ariaLabel: 'Sort' });
    expect(empty.getByRole('button', { name: 'Sort' }).textContent).toContain('Sort by');
    const chosen = render(Select, { options, value: 'size', ariaLabel: 'Order' });
    expect(chosen.getByRole('button', { name: 'Order' }).textContent).toContain('Size');
  });

  it('opens a list, chooses an option and closes', async () => {
    const onchange = vi.fn();
    const { getByRole, queryByRole } = render(Select, {
      options,
      value: 'name',
      ariaLabel: 'Sort',
      onchange,
    });
    const trigger = getByRole('button', { name: 'Sort' });
    await fireEvent.click(trigger);
    await tick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const list = getByRole('listbox');
    const chosen = getByRole('option', { name: 'Name' });
    expect(chosen.getAttribute('aria-selected')).toBe('true');
    expect(list.textContent).toContain('The last change');
    await fireEvent.click(getByRole('option', { name: /Date/ }));
    expect(onchange).toHaveBeenCalledWith('date');
    expect(queryByRole('listbox')).toBeNull();
    expect(trigger.textContent).toContain('Date');
  });

  it('closes with Escape without choosing', async () => {
    const onchange = vi.fn();
    const { getByRole, queryByRole } = render(Select, { options, ariaLabel: 'Sort', onchange });
    await fireEvent.click(getByRole('button', { name: 'Sort' }));
    await tick();
    await fireEvent.keyDown(getByRole('listbox'), { key: 'Escape' });
    expect(queryByRole('listbox')).toBeNull();
    expect(onchange).not.toHaveBeenCalled();
  });

  it('does not open when disabled', async () => {
    const { getByRole, queryByRole } = render(Select, {
      options,
      ariaLabel: 'Sort',
      disabled: true,
    });
    await fireEvent.click(getByRole('button', { name: 'Sort' }));
    expect(queryByRole('listbox')).toBeNull();
  });
});

describe('NativeSelect', () => {
  it('adds a placeholder line and reports the value', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(NativeSelect, {
      options,
      placeholder: 'Choose',
      ariaLabel: 'Sort',
      onchange,
    });
    const select = getByRole('combobox', { name: 'Sort' }) as HTMLSelectElement;
    expect(select.options[0].textContent).toBe('Choose');
    expect(select.required).toBe(true);
    await fireEvent.change(select, { target: { value: 'size' } });
    expect(onchange).toHaveBeenCalledWith('size');
  });
});

describe('Segmented', () => {
  it('presses the chosen option and reports a new one', async () => {
    const onchange = vi.fn();
    const { getAllByRole } = render(Segmented, {
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
      ],
      value: 'grid',
      ariaLabel: 'View',
      onchange,
    });
    const buttons = getAllByRole('button');
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
    await fireEvent.click(buttons[1]);
    expect(onchange).toHaveBeenCalledWith('list');
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
  });
});
