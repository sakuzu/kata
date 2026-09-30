import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FilterBar from '../../src/svelte/components/FilterBar.svelte';
import { setMessages } from '../../src/svelte/messages.js';

const items = [
  { kind: 'filter' as const, id: 'kind', label: 'Kind is shape' },
  { kind: 'word' as const, text: 'and' },
  { kind: 'filter' as const, id: 'color', label: 'Color is red' },
];

afterEach(() => setMessages({}, { reset: true }));

describe('FilterBar', () => {
  it('shows the sentence, the filters and the words in order, as a named group', () => {
    const { getByRole } = render(FilterBar, { sentence: 'Rows that match', items });
    const group = getByRole('group', { name: 'Filters' });
    expect(group.textContent).toMatch(/^\s*Rows that match.*Kind is shape.*and.*Color is red\s*$/s);
  });

  it('reports the filter that is pressed and the one that is removed', async () => {
    const onedit = vi.fn();
    const onremove = vi.fn();
    const { getByRole } = render(FilterBar, { sentence: 'Rows', items, onedit, onremove });
    await fireEvent.click(getByRole('button', { name: 'Color is red' }));
    expect(onedit).toHaveBeenCalledWith('color');
    await fireEvent.click(getByRole('button', { name: 'Remove Kind is shape' }));
    expect(onremove).toHaveBeenCalledWith('kind');
    expect(onedit).toHaveBeenCalledTimes(1);
  });

  it('shows no ✕ without onremove, and takes its strings from setMessages', () => {
    setMessages({ filters: 'Filter', removeFilter: ({ label }) => `${label} entfernen` });
    const without = render(FilterBar, { sentence: 'Rows', items });
    expect(without.queryByRole('button', { name: /entfernen/ })).toBeNull();
    const withRemove = render(FilterBar, { sentence: 'Rows', items, onremove: () => {} });
    expect(withRemove.getByRole('button', { name: 'Color is red entfernen' })).toBeTruthy();
    expect(withRemove.getAllByRole('group', { name: 'Filter' }).length).toBeGreaterThan(0);
  });
});
