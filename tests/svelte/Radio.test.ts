import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Radio from '../../src/svelte/components/Radio.svelte';
import RadioGroup from '../../src/svelte/components/RadioGroup.svelte';

const options = [
  { value: 'page', label: 'This page' },
  { value: 'all', label: 'All pages', description: 'Every page of the document' },
];

describe('Radio', () => {
  it('is checked when its value is the group value, and reports its value', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Radio, {
      name: 'scope',
      value: 'all',
      label: 'All pages',
      group: 'page',
      onchange,
    });
    const input = getByRole('radio', { name: 'All pages' }) as HTMLInputElement;
    expect(input.checked).toBe(false);
    await fireEvent.click(input);
    expect(onchange).toHaveBeenCalledWith('all');
  });

  it('keeps the small button height only without a description', () => {
    const one = render(Radio, { name: 'a', value: 'x', label: 'X' });
    expect(one.container.querySelector('label')?.getAttribute('data-h')).toBe('button-sm');
    const two = render(Radio, { name: 'b', value: 'y', label: 'Y', description: 'More' });
    expect(two.container.querySelector('label')?.hasAttribute('data-h')).toBe(false);
  });
});

describe('RadioGroup', () => {
  it('renders one radio per option, the value checked, and moves the choice', async () => {
    const { getAllByRole, getByText } = render(RadioGroup, {
      name: 'scope',
      options,
      value: 'page',
    });
    const radios = getAllByRole('radio') as HTMLInputElement[];
    expect(radios.map((r) => r.checked)).toEqual([true, false]);
    expect(getByText('Every page of the document')).toBeTruthy();
    await fireEvent.click(radios[1]);
    expect(radios.map((r) => r.checked)).toEqual([false, true]);
  });
});
