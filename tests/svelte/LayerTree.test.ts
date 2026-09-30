import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LayerTree, { type TreeNode } from '../../src/svelte/components/LayerTree.svelte';

// SortableJS needs real pointer input; the tests call the hooks the action gives it, as SortableJS
// does during a drag
type Options = {
  group: { put: (to: unknown, from: unknown, el: HTMLElement) => boolean };
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
const optionsOf = (el: Element | null) =>
  created.filter((c) => c.el === el).at(-1)?.options as Options;

const settle = async () => {
  await tick();
  await tick();
  await tick();
};

const leaf = (id: string, name = id): TreeNode => ({
  id,
  kind: 'shape',
  name,
  visible: true,
  locked: false,
});
function sample(): TreeNode[] {
  return [
    {
      id: 'l1',
      kind: 'layer',
      name: 'First',
      visible: true,
      locked: false,
      children: [
        {
          id: 'g1',
          kind: 'group',
          name: 'Group',
          visible: true,
          locked: false,
          children: [leaf('a')],
        },
        leaf('b'),
        leaf('c'),
      ],
    },
    {
      id: 'l2',
      kind: 'layer',
      name: 'Second',
      visible: false,
      locked: true,
      children: [leaf('d')],
    },
  ];
}
const open = ['l1', 'g1', 'l2'];

const row = (container: HTMLElement, id: string) => {
  const el = container.querySelector<HTMLElement>(
    `[role="treeitem"][data-node="${id}"] > [data-role="list-item"]`,
  );
  if (!el) throw new Error(`no row ${id}`);
  return el;
};
const zoneOf = (container: HTMLElement, id: string | null) =>
  container.querySelector<HTMLElement>(`[data-container="${id ? `node:${id}` : 'root'}"]`);

beforeEach(() => {
  created.length = 0;
});

describe('LayerTree', () => {
  it('selects a row, toggles with ⌘ or Ctrl and adds the range with Shift', async () => {
    const onselect = vi.fn();
    const { container } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      expanded: open,
      onselect,
    });
    await fireEvent.click(row(container, 'b'));
    expect(onselect).toHaveBeenLastCalledWith(['b'], { range: false, toggle: false });
    await fireEvent.click(row(container, 'l2'), { metaKey: true });
    expect(onselect).toHaveBeenLastCalledWith(['b', 'l2'], { range: false, toggle: true });
    await fireEvent.click(row(container, 'b'), { ctrlKey: true });
    expect(onselect).toHaveBeenLastCalledWith(['l2'], { range: false, toggle: true });
    await fireEvent.click(row(container, 'g1'));
    await fireEvent.click(row(container, 'c'), { shiftKey: true });
    expect(onselect).toHaveBeenLastCalledWith(['g1', 'a', 'b', 'c'], {
      range: true,
      toggle: false,
    });
    await tick();
    expect(row(container, 'a').parentElement?.getAttribute('aria-selected')).toBe('true');
  });

  it('opens and closes a group, and shows its children only when open', async () => {
    const onexpand = vi.fn();
    const { container, getAllByRole } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      onexpand,
    });
    expect(container.querySelector('[data-node="b"]')).toBeNull();
    await fireEvent.click(getAllByRole('button', { name: 'Expand' })[0]);
    expect(onexpand).toHaveBeenCalledWith('l1', true);
    await tick();
    expect(container.querySelector('[data-node="b"]')).not.toBeNull();
    await fireEvent.click(getAllByRole('button', { name: 'Collapse' })[0]);
    expect(onexpand).toHaveBeenLastCalledWith('l1', false);
    await tick();
    expect(container.querySelector('[data-node="b"]')).toBeNull();
  });

  it('reports the eye and the lock without selecting the row', async () => {
    const onvisible = vi.fn();
    const onlock = vi.fn();
    const onselect = vi.fn();
    const { getAllByRole } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      onvisible,
      onlock,
      onselect,
    });
    // The first layer is shown and open to editing, the second hidden and locked
    await fireEvent.click(getAllByRole('button', { name: 'Hide' })[0]);
    expect(onvisible).toHaveBeenCalledWith('l1', false);
    await fireEvent.click(getAllByRole('button', { name: 'Show' })[0]);
    expect(onvisible).toHaveBeenLastCalledWith('l2', true);
    await fireEvent.click(getAllByRole('button', { name: 'Lock' })[0]);
    expect(onlock).toHaveBeenCalledWith('l1', true);
    await fireEvent.click(getAllByRole('button', { name: 'Unlock' })[0]);
    expect(onlock).toHaveBeenLastCalledWith('l2', false);
    expect(onselect).not.toHaveBeenCalled();
  });

  it('renames in place with F2 and with a double click', async () => {
    const onrename = vi.fn();
    const onselect = vi.fn();
    const { container, getByRole, queryByRole } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      expanded: open,
      onrename,
      onselect,
    });
    await fireEvent.keyDown(row(container, 'b'), { key: 'F2' });
    await settle();
    const input = getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    expect(input.value).toBe('b');
    expect(document.activeElement).toBe(input);
    // Space types into the input and does not press the row
    await fireEvent.keyDown(input, { key: ' ' });
    expect(onselect).not.toHaveBeenCalled();
    await fireEvent.input(input, { target: { value: 'Bridge ' } });
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(onrename).toHaveBeenCalledWith('b', 'Bridge');
    await settle();
    expect(queryByRole('textbox')).toBeNull();

    await fireEvent.dblClick(row(container, 'c'));
    await settle();
    const again = getByRole('textbox', { name: 'Name' });
    await fireEvent.keyDown(again, { key: 'Escape' });
    await settle();
    expect(queryByRole('textbox')).toBeNull();
    expect(onrename).toHaveBeenCalledOnce();
  });

  it('moves the focus with the arrow keys, Home and End', async () => {
    const { container } = render(LayerTree, { nodes: sample(), label: 'Layers', expanded: open });
    const b = row(container, 'b');
    b.focus();
    await fireEvent.keyDown(b, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(row(container, 'c'));
    await fireEvent.keyDown(row(container, 'c'), { key: 'ArrowUp' });
    await fireEvent.keyDown(b, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(row(container, 'a'));
    // Left goes to the parent; right goes into an open group
    await fireEvent.keyDown(row(container, 'a'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(row(container, 'g1'));
    await fireEvent.keyDown(row(container, 'g1'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(row(container, 'a'));
    await fireEvent.keyDown(row(container, 'a'), { key: 'End' });
    expect(document.activeElement).toBe(row(container, 'd'));
    await fireEvent.keyDown(row(container, 'd'), { key: 'Home' });
    expect(document.activeElement).toBe(row(container, 'l1'));
  });

  it('reports a drop as the new parent and index', async () => {
    const onmove = vi.fn();
    const { container } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      expanded: open,
      onmove,
    });
    const from = zoneOf(container, 'l1');
    const to = zoneOf(container, 'g1');
    const item = container.querySelector<HTMLElement>('[data-sortable-item][data-id="c"]');
    if (!from || !to || !item) throw new Error('no zone');
    const o = optionsOf(from);
    o.onStart({ from, item });
    o.onEnd({ item, from, to, oldIndex: 2, newIndex: 0 });
    expect(onmove).toHaveBeenCalledWith({ id: 'c', parentId: 'g1', index: 0 });
    const root = zoneOf(container, null);
    if (!root) throw new Error('no root');
    const layer = container.querySelector<HTMLElement>('[data-sortable-item][data-id="l2"]');
    if (!layer) throw new Error('no layer');
    optionsOf(root).onStart({ from: root, item: layer });
    optionsOf(root).onEnd({ item: layer, from: root, to: root, oldIndex: 1, newIndex: 0 });
    expect(onmove).toHaveBeenLastCalledWith({ id: 'l2', parentId: null, index: 0 });
  });

  it('keeps a group at its depth unless allowNesting, and never drops a node into itself', () => {
    const put = (container: HTMLElement, zone: string | null, id: string) => {
      const el = container.querySelector<HTMLElement>(`[data-sortable-item][data-id="${id}"]`);
      if (!el) throw new Error(`no item ${id}`);
      return optionsOf(zoneOf(container, zone)).group.put(null, null, el);
    };
    const kept = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      expanded: open,
      onmove: () => {},
    }).container;
    expect(put(kept, 'l2', 'g1')).toBe(true); // a group into another layer: the same depth
    expect(put(kept, 'g1', 'l2')).toBe(false); // a layer into a group
    expect(put(kept, null, 'g1')).toBe(false); // a group out to the root
    expect(put(kept, 'l1', 'l2')).toBe(false); // a layer into a layer
    expect(put(kept, 'g1', 'd')).toBe(true); // a leaf anywhere
    expect(put(kept, null, 'd')).toBe(true);

    created.length = 0;
    const nested = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      expanded: open,
      onmove: () => {},
      allowNesting: true,
      canDrop: (node, parent) => !(node.kind === 'shape' && parent === null),
    }).container;
    expect(put(nested, 'l2', 'l1')).toBe(true);
    expect(put(nested, 'g1', 'l1')).toBe(false); // into itself
    expect(put(nested, null, 'd')).toBe(false); // the application's rule
  });

  it('opens the add menu in its head and draws a kind through row', async () => {
    const onadd = vi.fn();
    const custom = createRawSnippet((node: () => TreeNode) => ({
      render: () => `<span>${node().kind}: ${node().name}</span>`,
    }));
    const { getByRole, container } = render(LayerTree, {
      nodes: sample(),
      label: 'Layers',
      addMenu: [
        { id: 'layer', label: 'Layer' },
        { id: 'group', label: 'Group' },
      ],
      onadd,
      row: custom as never,
    });
    expect(container.textContent).toContain('layer: First');
    await fireEvent.click(getByRole('button', { name: 'Add' }));
    await settle();
    await fireEvent.click(getByRole('menuitem', { name: 'Group' }));
    expect(onadd).toHaveBeenCalledWith('group');
  });
});
