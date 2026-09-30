import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppMenu from '../../src/svelte/components/AppMenu.svelte';
import Kebab from '../../src/svelte/components/Kebab.svelte';
import MenuList from '../../src/svelte/components/MenuList.svelte';
import MenuSheet from '../../src/svelte/components/MenuSheet.svelte';
import Topbar from '../../src/svelte/components/Topbar.svelte';
import type { MenuModel } from '../../src/svelte/lib/menuModel.js';
import { setMessages } from '../../src/svelte/messages.js';

const settle = async () => {
  await tick();
  await tick();
  await tick();
};

const model: MenuModel[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New', kbd: '⌘N' },
      { id: 'export', label: 'Export', items: [{ id: 'png', label: 'PNG' }] },
    ],
  },
  { id: 'undo', label: 'Undo' },
  { id: 'redo', label: 'Redo', disabled: true },
  { divider: true },
  { heading: 'Show' },
  { id: 'grid', label: 'Grid', checked: true },
];

const names = (items: HTMLElement[]) => items.map((i) => i.textContent?.trim());

describe('MenuList', () => {
  it('draws items, dividers, headings and the column of check marks', () => {
    const { getAllByRole, getByRole, container } = render(MenuList, { items: model });
    expect(names(getAllByRole('menuitem'))).toEqual(['File', 'Undo', 'Redo', 'Grid']);
    expect(getByRole('separator')).toBeTruthy();
    expect(container.textContent).toContain('Show');
    // Every item of the level keeps the column, the checked one has the mark
    expect(container.querySelectorAll('.chk')).toHaveLength(4);
    expect(container.querySelectorAll('.chk svg')).toHaveLength(1);
    expect(getByRole('menuitem', { name: 'File' }).getAttribute('aria-haspopup')).toBe('menu');
  });

  it('reports the chosen item and closes, and ignores a disabled one', async () => {
    const onselect = vi.fn();
    const onclose = vi.fn();
    const { getByRole } = render(MenuList, { items: model, onselect, onclose });
    await fireEvent.click(getByRole('menuitem', { name: 'Redo' }));
    expect(onselect).not.toHaveBeenCalled();
    await fireEvent.click(getByRole('menuitem', { name: 'Undo' }));
    expect(onselect).toHaveBeenCalledWith('undo');
    expect(onclose).toHaveBeenCalledOnce();
  });

  it('moves with the arrow keys, Home and End, wrapping at the ends', async () => {
    const { getAllByRole } = render(MenuList, { items: model });
    const items = getAllByRole('menuitem');
    items[0].focus();
    await fireEvent.keyDown(items[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(items[1]);
    await fireEvent.keyDown(items[1], { key: 'ArrowUp' });
    await fireEvent.keyDown(items[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(items[3]);
    await fireEvent.keyDown(items[3], { key: 'Home' });
    expect(document.activeElement).toBe(items[0]);
    await fireEvent.keyDown(items[0], { key: 'End' });
    expect(document.activeElement).toBe(items[3]);
  });

  it('opens a submenu with the right arrow and goes back with the left one', async () => {
    const onselect = vi.fn();
    const { getByRole, queryByRole } = render(MenuList, { items: model, onselect });
    const file = getByRole('menuitem', { name: 'File' });
    file.focus();
    await fireEvent.keyDown(file, { key: 'ArrowRight' });
    await settle();
    expect(file.getAttribute('aria-expanded')).toBe('true');
    const first = getByRole('menuitem', { name: /New/ });
    expect(document.activeElement).toBe(first);
    await fireEvent.keyDown(first, { key: 'ArrowLeft' });
    await settle();
    expect(queryByRole('menuitem', { name: /New/ })).toBeNull();
    expect(document.activeElement).toBe(getByRole('menuitem', { name: 'File' }));
  });

  it('opens a submenu on hover and reports an item of a nested submenu', async () => {
    const onselect = vi.fn();
    const { getByRole } = render(MenuList, { items: model, onselect });
    await fireEvent.mouseEnter(getByRole('menuitem', { name: 'File' }));
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: 'Export' }));
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: 'PNG' }));
    expect(onselect).toHaveBeenCalledWith('png');
  });

  it('inline: a submenu takes the place of the list, under a row that goes back', async () => {
    const { getByRole, queryByRole } = render(MenuList, { items: model, inline: true });
    await fireEvent.click(getByRole('menuitem', { name: 'File' }));
    await settle();
    expect(queryByRole('menuitem', { name: 'Undo' })).toBeNull();
    const back = getByRole('menuitem', { name: 'File' });
    expect(getByRole('menuitem', { name: /New/ })).toBeTruthy();
    await fireEvent.click(back);
    await settle();
    expect(getByRole('menuitem', { name: 'Undo' })).toBeTruthy();
  });
});

describe('AppMenu', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('opens the model behind one button and reports the choice', async () => {
    const onselect = vi.fn();
    const { getByRole, queryByRole } = render(AppMenu, { items: model, onselect });
    const trigger = getByRole('button', { name: 'Menu' });
    await fireEvent.click(trigger);
    await settle();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(getByRole('menuitem', { name: 'Undo' }));
    await settle();
    expect(onselect).toHaveBeenCalledWith('undo');
    expect(queryByRole('menuitem', { name: 'Undo' })).toBeNull();
  });

  it('takes the name of its trigger from the messages', () => {
    setMessages({ menu: 'Menü' });
    const { getByRole } = render(AppMenu, { items: model, icon: 'ellipsis' });
    expect(getByRole('button', { name: 'Menü' })).toBeTruthy();
  });
});

describe('MenuSheet', () => {
  it('shows the model in a sheet and closes when an item is chosen', async () => {
    const onselect = vi.fn();
    const onclose = vi.fn();
    const { getByRole, queryByRole } = render(MenuSheet, {
      items: model,
      open: true,
      onselect,
      onclose,
    });
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: 'File' }));
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: /New/ }));
    await settle();
    expect(onselect).toHaveBeenCalledWith('new');
    expect(onclose).toHaveBeenCalledOnce();
    expect(queryByRole('menuitem')).toBeNull();
  });

  it('closes with Escape', async () => {
    const onclose = vi.fn();
    render(MenuSheet, { items: model, open: true, onclose });
    await settle();
    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onclose).toHaveBeenCalledOnce();
  });
});

describe('Kebab and Topbar with a model', () => {
  it('Kebab draws the model instead of its fixed actions', async () => {
    const onselect = vi.fn();
    const { getByRole, getAllByRole } = render(Kebab, {
      items: [{ id: 'rename', label: 'Rename' }],
      onselect,
    });
    await fireEvent.click(getByRole('button', { name: 'Actions' }));
    await settle();
    expect(names(getAllByRole('menuitem'))).toEqual(['Rename']);
    await fireEvent.click(getByRole('menuitem', { name: 'Rename' }));
    expect(onselect).toHaveBeenCalledWith('rename');
  });

  it('Topbar opens the model from its brand', async () => {
    const onmenu = vi.fn();
    const { getByRole } = render(Topbar, {
      brand: 'Sketchbook',
      brandLabel: 'Sketchbook menu',
      menu: model,
      onmenu,
    });
    await fireEvent.click(getByRole('button', { name: 'Sketchbook menu' }));
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: 'Undo' }));
    expect(onmenu).toHaveBeenCalledWith('undo');
  });
});
