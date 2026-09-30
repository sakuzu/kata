import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import List from '../../src/svelte/components/List.svelte';
import ListItem from '../../src/svelte/components/ListItem.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('ListItem', () => {
  it('is a button that Enter and Space press, when it has onclick', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(ListItem, {
      columns: 'minmax(0, 1fr)',
      onclick,
      children: text('Photos'),
    });
    const item = getByRole('button');
    expect(item.getAttribute('tabindex')).toBe('0');
    await fireEvent.click(item);
    await fireEvent.keyDown(item, { key: 'Enter' });
    await fireEvent.keyDown(item, { key: ' ' });
    await fireEvent.keyDown(item, { key: 'a' });
    expect(onclick).toHaveBeenCalledTimes(3);
  });

  it('is not pressable when plain or without an action', () => {
    const plain = render(ListItem, {
      columns: '1fr',
      plain: true,
      onclick: () => {},
      children: text('A'),
    });
    expect(plain.queryByRole('button')).toBeNull();
    const still = render(ListItem, { columns: '1fr', children: text('B') });
    expect(still.queryByRole('button')).toBeNull();
  });

  it('renders a link with href', () => {
    const { container } = render(ListItem, { columns: '1fr', href: '/a', children: text('A') });
    expect(container.querySelector('a[data-role="list-item"]')?.getAttribute('href')).toBe('/a');
  });

  it('shows the selection and declares its line', () => {
    const { container } = render(ListItem, {
      columns: '1fr',
      sel: true,
      rule: true,
      'aria-selected': 'true',
      children: text('A'),
    });
    const item = container.querySelector('[data-role="list-item"]');
    expect(item?.classList.contains('sel')).toBe(true);
    expect(item?.hasAttribute('data-rule')).toBe(true);
    expect(item?.getAttribute('aria-selected')).toBe('true');
    expect((item as HTMLElement).style.gridTemplateColumns).toBe('1fr');
  });

  it('lets a keydown handler that prevents the default keep the key', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(ListItem, {
      columns: '1fr',
      onclick,
      onkeydown: (e: KeyboardEvent) => e.preventDefault(),
      children: text('A'),
    });
    await fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(onclick).not.toHaveBeenCalled();
  });
});

describe('List', () => {
  it('is a named list with the least height of its rows', () => {
    const { getByRole } = render(List, { label: 'Documents', rows: 'mark', children: text('') });
    const list = getByRole('list', { name: 'Documents' });
    expect(list.getAttribute('data-rows')).toBe('mark');
  });

  it('takes the group role for a list of choices', () => {
    const { getByRole } = render(List, { label: 'Icons', role: 'group', children: text('') });
    expect(getByRole('group', { name: 'Icons' })).toBeTruthy();
  });
});
