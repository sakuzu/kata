import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Kebab from '../../src/svelte/components/Kebab.svelte';
import MenuHead from '../../src/svelte/components/MenuHead.svelte';
import MenuItem from '../../src/svelte/components/MenuItem.svelte';
import { setMessages } from '../../src/svelte/messages.js';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

const settle = async () => {
  await tick();
  await tick();
  await tick();
};

async function openKebab(props: Parameters<typeof render<typeof Kebab>>[1]) {
  const view = render(Kebab, props);
  const trigger = view.getByRole('button', { name: 'Actions' });
  trigger.focus();
  await fireEvent.click(trigger);
  await settle();
  return { ...view, trigger };
}

describe('MenuItem', () => {
  it('is a menu item that reports a press, and does nothing when disabled', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(MenuItem, { onclick, kbd: '⌘D', children: text('Duplicate') });
    const item = getByRole('menuitem');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.textContent).toContain('⌘D');
    await fireEvent.click(item);
    expect(onclick).toHaveBeenCalledOnce();

    const off = vi.fn();
    const disabled = render(MenuItem, { onclick: off, disabled: true, children: text('Move') });
    const item2 = disabled.getAllByRole('menuitem')[1];
    expect(item2.getAttribute('aria-disabled')).toBe('true');
    await fireEvent.click(item2);
    expect(off).not.toHaveBeenCalled();
  });

  it('renders a link with href, and a column of check marks with checked', () => {
    const link = render(MenuItem, { href: '/account', children: text('Account') });
    expect(link.container.querySelector('a[role="menuitem"]')?.getAttribute('href')).toBe(
      '/account',
    );
    const chk = render(MenuItem, { checked: false, children: text('Name') });
    expect(chk.container.querySelector('.chk')).not.toBeNull();
    expect(chk.container.querySelector('.chk svg')).toBeNull();
  });
});

describe('MenuHead', () => {
  it('names a group and cannot be pressed', () => {
    const { container, queryByRole } = render(MenuHead, { children: text('Text size') });
    expect(container.textContent).toContain('Text size');
    expect(queryByRole('menuitem')).toBeNull();
    expect(queryByRole('button')).toBeNull();
  });
});

describe('Kebab and the keys of a menu', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('opens a menu in the fixed order, with delete last after a divider', async () => {
    const { getByRole, getAllByRole, trigger } = await openKebab({
      onaction: () => {},
      actions: ['delete', 'copy', 'settings'],
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(getByRole('menu')).toBeTruthy();
    const names = getAllByRole('menuitem').map((i) => i.textContent?.trim());
    expect(names).toEqual(['Settings', 'Duplicate', 'Delete…']);
    expect(getByRole('separator')).toBeTruthy();
  });

  it('focuses the first item and moves with the arrow keys, Home and End', async () => {
    const { getByRole, getAllByRole } = await openKebab({ onaction: () => {} });
    const items = getAllByRole('menuitem');
    const menu = getByRole('menu');
    await vi.waitFor(() => expect(document.activeElement).toBe(items[0]));
    await fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
    await fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(items[items.length - 1]);
    await fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[0]);
    await fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items[items.length - 1]);
    await fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
  });

  it('closes with Escape and returns the focus to the trigger', async () => {
    const { queryByRole, trigger } = await openKebab({ onaction: () => {} });
    await fireEvent.keyDown(window, { key: 'Escape' });
    await settle();
    expect(queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes with Tab, and on a press outside', async () => {
    const first = await openKebab({ onaction: () => {} });
    await fireEvent.keyDown(first.getByRole('menu'), { key: 'Tab' });
    await settle();
    expect(first.queryByRole('menu')).toBeNull();
    first.unmount();

    const second = await openKebab({ onaction: () => {} });
    await fireEvent.pointerDown(document.body);
    await settle();
    expect(second.queryByRole('menu')).toBeNull();
  });

  it('reports the chosen action and closes', async () => {
    const onaction = vi.fn();
    const { getByRole, queryByRole } = await openKebab({ onaction });
    await fireEvent.click(getByRole('menuitem', { name: 'Move' }));
    await settle();
    expect(onaction).toHaveBeenCalledWith('move');
    expect(queryByRole('menu')).toBeNull();
  });

  it('takes its names from the messages', async () => {
    setMessages({ actions: 'Aktionen', delete: 'Löschen' });
    const view = render(Kebab, { onaction: () => {}, actions: ['delete'] });
    await fireEvent.click(view.getByRole('button', { name: 'Aktionen' }));
    await settle();
    expect(view.getByRole('menuitem').textContent?.trim()).toBe('Löschen…');
  });
});
