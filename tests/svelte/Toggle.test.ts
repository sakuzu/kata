import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from '../../src/svelte/components/Checkbox.svelte';
import Toggle from '../../src/svelte/components/Toggle.svelte';

describe('Toggle', () => {
  it('is a switch named by its label that reports the new state', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Toggle, { label: 'Snap to grid', onchange });
    const input = getByRole('switch', { name: 'Snap to grid' }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    await fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(onchange).toHaveBeenCalledWith(true);
  });

  it('switches when its text is pressed', async () => {
    const { getByText, getByRole } = render(Toggle, { label: 'Snap to grid', checked: true });
    await fireEvent.click(getByText('Snap to grid'));
    expect((getByRole('switch') as HTMLInputElement).checked).toBe(false);
  });

  it('puts the text first with between', () => {
    const { container } = render(Toggle, { label: 'Snap', between: true });
    expect(container.querySelector('label')?.firstElementChild?.tagName).toBe('SPAN');
  });

  it('does not change when disabled', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Toggle, { ariaLabel: 'Snap', disabled: true, onchange });
    expect((getByRole('switch') as HTMLInputElement).disabled).toBe(true);
  });
});

describe('Checkbox', () => {
  it('reports the new state', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Checkbox, { label: 'Share', onchange });
    await fireEvent.click(getByRole('checkbox', { name: 'Share' }));
    expect(onchange).toHaveBeenCalledWith(true);
  });

  it('sets indeterminate as a property of the input', () => {
    const { getByRole } = render(Checkbox, { ariaLabel: 'Select all', indeterminate: true });
    expect((getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
  });
});
