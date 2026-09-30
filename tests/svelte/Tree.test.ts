import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TreeRow from '../../src/svelte/components/TreeRow.svelte';
import TreeHarness from './TreeHarness.svelte';

// SortableJS needs real pointer input; the tests stand in for it by calling the hooks the action
// gives it, as SortableJS does during a drag
type Hooks = {
  onStart: (e: { from: HTMLElement; item: HTMLElement }) => void;
  onEnd: (e: {
    item: HTMLElement;
    from: HTMLElement;
    to: HTMLElement;
    oldIndex: number;
    newIndex: number;
  }) => void;
};
const created = vi.hoisted(() => [] as { el: HTMLElement; options: unknown }[]);
vi.mock('sortablejs', () => ({
  default: {
    create: (el: HTMLElement, options: unknown) => {
      created.push({ el, options });
      return { destroy: () => {} };
    },
  },
}));
const hooksOf = (el: HTMLElement) => created.find((c) => c.el === el)?.options as Hooks;

const name = createRawSnippet(() => ({ render: () => '<span>Background</span>' }));

beforeEach(() => {
  created.length = 0;
});

describe('TreeRow', () => {
  it('opens and closes with its chevron without pressing the row', async () => {
    const onclick = vi.fn();
    const ontoggle = vi.fn();
    const { getByRole } = render(TreeRow, { expandable: true, onclick, ontoggle, children: name });
    const item = getByRole('treeitem');
    expect(item.getAttribute('aria-expanded')).toBe('false');
    await fireEvent.click(getByRole('button', { name: 'Expand' }));
    expect(item.getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(getByRole('button', { name: 'Collapse' }));
    expect(item.getAttribute('aria-expanded')).toBe('false');
    expect(ontoggle.mock.calls).toEqual([[true], [false]]);
    expect(onclick).not.toHaveBeenCalled();
  });

  it('opens with the right arrow key and closes with the left one', async () => {
    const { getByRole } = render(TreeRow, {
      expandable: true,
      onclick: () => {},
      children: name,
    });
    const row = getByRole('button', { name: /Background/ });
    await fireEvent.keyDown(row, { key: 'ArrowRight' });
    expect(getByRole('treeitem').getAttribute('aria-expanded')).toBe('true');
    await fireEvent.keyDown(row, { key: 'ArrowLeft' });
    expect(getByRole('treeitem').getAttribute('aria-expanded')).toBe('false');
  });

  it('is pressed with a click, Enter or Space, and shows its depth and selection', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(TreeRow, { depth: 2, sel: true, onclick, children: name });
    const row = getByRole('button', { name: /Background/ });
    await fireEvent.click(row);
    await fireEvent.keyDown(row, { key: 'Enter' });
    await fireEvent.keyDown(row, { key: ' ' });
    expect(onclick).toHaveBeenCalledTimes(3);
    const item = getByRole('treeitem');
    expect(item.getAttribute('aria-level')).toBe('3');
    expect(item.getAttribute('aria-selected')).toBe('true');
  });
});

describe('Tree with sortable', () => {
  it('shows and hides the rows of a group', async () => {
    const { getByRole, getByTestId } = render(TreeHarness);
    expect(getByTestId('g2').hidden).toBe(true);
    await fireEvent.click(getByRole('button', { name: 'Expand' }));
    expect(getByTestId('g2').hidden).toBe(false);
  });

  it('reports a move within a group, puts the DOM back and redraws from the data', async () => {
    const onDrop = vi.fn();
    const { getByTestId } = render(TreeHarness, { onDrop });
    const zone = getByTestId('g1');
    const [a, b] = [...zone.querySelectorAll<HTMLElement>('[data-sortable-item]')];
    const hooks = hooksOf(zone);
    hooks.onStart({ from: zone, item: b });
    zone.insertBefore(b, a); // what SortableJS does to the DOM during the drag
    hooks.onEnd({ item: b, from: zone, to: zone, oldIndex: 1, newIndex: 0 });
    expect(onDrop).toHaveBeenCalledWith({
      itemId: 'b',
      from: 'g1',
      to: 'g1',
      oldIndex: 1,
      newIndex: 0,
    });
    await tick();
    expect(idsIn(zone)).toEqual(['b', 'a']);
  });

  it('moves a row into another group', async () => {
    const { getByTestId } = render(TreeHarness);
    const from = getByTestId('g1');
    const to = getByTestId('g2');
    const a = from.querySelector<HTMLElement>('[data-id="a"]');
    if (!a) throw new Error('no row');
    const hooks = hooksOf(from);
    hooks.onStart({ from, item: a });
    to.appendChild(a);
    hooks.onEnd({ item: a, from, to, oldIndex: 0, newIndex: 1 });
    await tick();
    expect(idsIn(from)).toEqual(['b']);
    expect(idsIn(to)).toEqual(['c', 'a']);
  });

  it('reports nothing when the row is dropped where it was', () => {
    const onDrop = vi.fn();
    const { getByTestId } = render(TreeHarness, { onDrop });
    const zone = getByTestId('g1');
    const a = zone.querySelector<HTMLElement>('[data-id="a"]');
    if (!a) throw new Error('no row');
    const hooks = hooksOf(zone);
    hooks.onStart({ from: zone, item: a });
    hooks.onEnd({ item: a, from: zone, to: zone, oldIndex: 0, newIndex: 0 });
    expect(onDrop).not.toHaveBeenCalled();
  });
});

function idsIn(zone: HTMLElement): string[] {
  return [...zone.querySelectorAll<HTMLElement>('[data-sortable-item]')].map(
    (el) => el.getAttribute('data-id') ?? '',
  );
}
