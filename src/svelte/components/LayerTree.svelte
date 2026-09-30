<script lang="ts" module>
  import type { IconSource } from '../icons.js';

  /** One node of a LayerTree. A node with children (an array, even empty) is a group. */
  export interface TreeNode {
    id: string;
    /** What the node is, in the application's words; the tree only passes it back */
    kind: string;
    name: string;
    /** The mark before the name */
    icon?: IconSource;
    /** The color of the mark (a CSS color) */
    iconColor?: string;
    visible: boolean;
    locked: boolean;
    children?: TreeNode[];
    /** The application's own fields */
    data?: unknown;
  }

  /** The keys held when a row was pressed: Shift (range) and ⌘ or Ctrl (toggle) */
  export interface TreeSelectModifiers {
    range: boolean;
    toggle: boolean;
  }

  /** A node dropped in a new place: its new parent (null for the root) and its index there */
  export interface TreeMove {
    id: string;
    parentId: string | null;
    index: number;
  }

  // Each tree drags within itself only
  let trees = 0;
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';
  import type { MenuModel } from '../lib/menuModel.js';
  import { getMessages } from '../messages.js';
  import { type SortableParams, type SortMove, type SortOver, sortable } from '../sortable.js';
  import Button from './Button.svelte';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import InlineEdit from './InlineEdit.svelte';
  import Markbox from './Markbox.svelte';
  import MenuList from './MenuList.svelte';
  import SectionHeader from './SectionHeader.svelte';
  import Swatch from './Swatch.svelte';
  import Text from './Text.svelte';
  import Tree from './Tree.svelte';
  import TreeRow from './TreeRow.svelte';

  // LayerTree: the layers of a drawing and what they hold, as a tree: a Tree of TreeRows with a
  // head (a SectionHeader with the add menu). The nodes are data of one general shape (TreeNode);
  // the tree knows nothing of what a kind is. The application keeps the nodes, the selection and
  // the open groups, and applies what the tree reports.
  //
  // A row shows the node's mark and name, and on the right its actions, the eye and the lock (each
  // when its callback is given). row(node, name) draws the part before the actions for a kind of
  // its own, and renders name(node) where the name goes; actions(node) adds actions before the
  // eye. A press selects (Shift adds the range, ⌘ or Ctrl toggles), F2 or a double click renames in
  // place, and with onmove the rows are reordered by dragging: a node goes into any open group, but
  // a group keeps its depth unless allowNesting, so a group never enters another group.
  //
  //   <LayerTree label="Layers" {nodes} bind:selected bind:expanded
  //     onvisible={show} onlock={lock} onrename={rename} onmove={move}
  //     addMenu={[{ id: 'layer', label: 'Layer' }]} onadd={add} />
  let {
    nodes,
    label,
    head = true,
    selected = $bindable([]),
    onselect,
    expanded = $bindable([]),
    onexpand,
    onvisible,
    onlock,
    onrename,
    onmove,
    allowNesting = false,
    canDrop,
    gripOnly = false,
    addMenu,
    onadd,
    addLabel,
    row,
    actions,
  }: {
    /** The nodes at the root, in the order they show */
    nodes: TreeNode[];
    /** The name of the tree, and the title of its head */
    label: string;
    /** Shows the head (the title and the add menu) */
    head?: boolean;
    /** The ids of the selected nodes */
    selected?: string[];
    /** Called with the new selection and the keys held */
    onselect?: (ids: string[], modifiers: TreeSelectModifiers) => void;
    /** The ids of the open groups */
    expanded?: string[];
    /** Called when a group opens or closes */
    onexpand?: (id: string, open: boolean) => void;
    /** Shows the eye; called with the node's new visibility */
    onvisible?: (id: string, visible: boolean) => void;
    /** Shows the lock; called with the node's new state */
    onlock?: (id: string, locked: boolean) => void;
    /** Lets a name be changed in place; called with the new name */
    onrename?: (id: string, name: string) => void;
    /** Lets the rows be reordered by dragging; called after a drop */
    onmove?: (move: TreeMove) => void;
    /** A group may go into another group */
    allowNesting?: boolean;
    /** A rule of the application: whether a node may go into a parent (null for the root) */
    canDrop?: (node: TreeNode, parent: TreeNode | null) => boolean;
    /** Rows are picked up by their grip only, which always shows (screens without hover) */
    gripOnly?: boolean;
    /** The menu of the add button in the head */
    addMenu?: MenuModel[];
    /** Called with the id of the item of the add menu that was chosen */
    onadd?: (id: string) => void;
    /** The text of the add button ("Add" by default) */
    addLabel?: string;
    /** Draws the part of a row before its actions: the mark, name(node) and anything after it */
    row?: Snippet<[TreeNode, Snippet<[TreeNode]>]>;
    /** Actions of a row before the eye and the lock */
    actions?: Snippet<[TreeNode]>;
  } = $props();

  const group = `kata-layer-tree-${++trees}`;
  const ROOT = 'root';
  const zoneId = (parent: TreeNode | null) => (parent ? `node:${parent.id}` : ROOT);

  // Where each node is: the node, its parent and its depth
  const index = $derived.by(() => {
    const map = new Map<string, { node: TreeNode; parent: TreeNode | null; depth: number }>();
    const walk = (list: TreeNode[], parent: TreeNode | null, depth: number) => {
      for (const node of list) {
        map.set(node.id, { node, parent, depth });
        if (node.children) walk(node.children, node, depth + 1);
      }
    };
    walk(nodes, null, 0);
    return map;
  });
  const openSet = $derived(new Set(expanded));
  const selSet = $derived(new Set(selected));
  // The ids of the rows that show, in order
  const shown = $derived.by(() => {
    const ids: string[] = [];
    const walk = (list: TreeNode[]) => {
      for (const node of list) {
        ids.push(node.id);
        if (node.children && openSet.has(node.id)) walk(node.children);
      }
    };
    walk(nodes);
    return ids;
  });
  const hasEnd = $derived(!!(onvisible || onlock || actions));

  let root = $state<HTMLElement>();

  function setOpen(id: string, open: boolean) {
    if (open === openSet.has(id)) return;
    expanded = open ? [...expanded, id] : expanded.filter((x) => x !== id);
    onexpand?.(id, open);
  }

  // ---- Selection ----
  // The node a range starts from: the last one pressed without Shift
  let anchor: string | null = null;

  function pick(node: TreeNode, e?: MouseEvent) {
    const modifiers = { range: !!e?.shiftKey, toggle: !!(e?.metaKey || e?.ctrlKey) };
    let ids: string[];
    const from = anchor ? shown.indexOf(anchor) : -1;
    const to = shown.indexOf(node.id);
    if (modifiers.range && from !== -1 && to !== -1) {
      ids = shown.slice(Math.min(from, to), Math.max(from, to) + 1);
    } else if (modifiers.toggle) {
      ids = selSet.has(node.id) ? selected.filter((x) => x !== node.id) : [...selected, node.id];
      anchor = node.id;
    } else {
      ids = [node.id];
      anchor = node.id;
    }
    selected = ids;
    onselect?.(ids, modifiers);
  }

  // ---- Renaming ----
  let renaming = $state<string | null>(null);

  function startRename(id: string) {
    if (onrename) renaming = id;
  }
  function endRename(id: string) {
    if (renaming !== id) return;
    renaming = null;
    // The focus returns to the row, unless it went somewhere else
    void tick().then(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      rowOf(id)?.focus();
    });
  }
  // ---- Keys ----
  function rows(): HTMLElement[] {
    if (!root) return [];
    return [...root.querySelectorAll<HTMLElement>('[role="treeitem"] > [data-role="list-item"]')];
  }
  function rowOf(id: string): HTMLElement | undefined {
    return root?.querySelector<HTMLElement>(
      `[role="treeitem"][data-node="${CSS.escape(id)}"] > [data-role="list-item"]`,
    ) ?? undefined;
  }

  // The up and down arrows, Home and End move between the rows; the right arrow goes into an open
  // group and the left one out to the parent (a row that opens or closes handles them first); F2
  // renames. Enter and Space press the row (ListItem).
  function onkeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (!target.matches('[role="treeitem"] > [data-role="list-item"]')) return;
    const id = target.parentElement?.getAttribute('data-node');
    const at = id ? index.get(id) : undefined;
    if (!at || e.defaultPrevented) return;
    const list = rows();
    const i = list.indexOf(target);
    const go = (el: HTMLElement | undefined) => {
      e.preventDefault();
      el?.focus();
    };
    if (e.key === 'ArrowDown') go(list[i + 1]);
    else if (e.key === 'ArrowUp') go(list[i - 1]);
    else if (e.key === 'Home') go(list[0]);
    else if (e.key === 'End') go(list[list.length - 1]);
    else if (e.key === 'ArrowRight' && at.node.children?.length && openSet.has(at.node.id))
      go(list[i + 1]);
    else if (e.key === 'ArrowLeft' && at.parent) go(rowOf(at.parent.id));
    else if (e.key === 'F2' && onrename) {
      e.preventDefault();
      startRename(at.node.id);
    }
  }
  function keys(node: HTMLElement) {
    node.addEventListener('keydown', onkeydown);
    return { destroy: () => node.removeEventListener('keydown', onkeydown) };
  }

  // ---- Dragging ----
  // Whether a node may go into a parent: never into itself or below it; a group keeps its depth
  // unless allowNesting; then the application's rule
  function allowed(id: string, parent: TreeNode | null): boolean {
    const at = index.get(id);
    if (!at) return false;
    for (let p = parent; p; p = index.get(p.id)?.parent ?? null) if (p.id === id) return false;
    if (!allowNesting && at.node.children) {
      const depth = parent ? (index.get(parent.id)?.depth ?? 0) + 1 : 0;
      if (depth !== at.depth) return false;
    }
    return canDrop ? canDrop(at.node, parent) : true;
  }

  function drop(m: SortMove) {
    const parentId = m.to === ROOT ? null : m.to.slice('node:'.length);
    const parent = parentId ? (index.get(parentId)?.node ?? null) : null;
    if (!allowed(m.itemId, parent)) return;
    onmove?.({ id: m.itemId, parentId, index: m.newIndex });
  }

  // A closed group that the dragged node may enter opens after a moment under the pointer
  let springId: string | null = null;
  let springTimer = 0;
  function clearSpring() {
    if (springTimer) clearTimeout(springTimer);
    springTimer = 0;
    springId = null;
  }
  function over(info: SortOver | null): boolean {
    const target = info ? index.get(info.overId)?.node : undefined;
    if (!info || !target?.children || openSet.has(target.id) || !allowed(info.dragId, target)) {
      clearSpring();
      return false;
    }
    if (springId !== target.id) {
      clearSpring();
      springId = target.id;
      springTimer = window.setTimeout(() => {
        if (springId) setOpen(springId, true);
        clearSpring();
      }, 550);
    }
    return true;
  }

  function zone(parent: TreeNode | null): SortableParams {
    return {
      group,
      containerId: zoneId(parent),
      handle: gripOnly ? '[data-grip]' : null,
      filter: 'button, input, textarea',
      accept: (_kind, id) => allowed(id, parent),
      enabled: !!onmove,
      onDrop: drop,
      onOver: over,
    };
  }

  function rowProps(node: TreeNode, depth: number, parentHidden: boolean) {
    return {
      depth,
      expandable: !!node.children,
      expanded: openSet.has(node.id),
      ontoggle: (open: boolean) => setOpen(node.id, open),
      grip: !!onmove,
      gripShow: gripOnly && !!onmove,
      hidden: !node.visible,
      dimmed: parentHidden,
      sel: selSet.has(node.id),
      onclick: (e: MouseEvent) => pick(node, e),
      ondblclick: (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('button')) startRename(node.id);
      },
      'data-node': node.id,
    };
  }
</script>

{#snippet name(node: TreeNode)}
  {#if renaming === node.id}
    <span class="rename">
      <InlineEdit
        value={node.name}
        placeholder={getMessages().rename}
        bind:editing={() => true, (v) => !v && endRename(node.id)}
        onCommit={(v) => onrename?.(node.id, v)}
      />
    </span>
  {:else}
    <Text clamp>{node.name}</Text>
  {/if}
{/snippet}

{#snippet mark(node: TreeNode)}
  {#if node.icon}
    <Markbox>
      {#if node.iconColor}
        <Swatch shape="icon" icon={node.icon} color={node.iconColor} />
      {:else}
        <Icon name={node.icon} />
      {/if}
    </Markbox>
  {/if}
{/snippet}

{#snippet body(node: TreeNode)}
  {#if row}
    {@render row(node, name)}
  {:else}
    {@render mark(node)}
    {@render name(node)}
  {/if}
{/snippet}

{#snippet tools(node: TreeNode)}
  {@render actions?.(node)}
  {#if onvisible}
    <Button
      variant="ghost"
      icon
      aria-label={node.visible ? getMessages().hide : getMessages().show}
      data-keep={node.visible ? undefined : ''}
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        onvisible?.(node.id, !node.visible);
      }}><Icon name={node.visible ? 'eye' : 'eye-off'} /></Button
    >
  {/if}
  {#if onlock}
    <Button
      variant="ghost"
      icon
      aria-label={node.locked ? getMessages().unlock : getMessages().lock}
      data-keep={node.locked ? '' : undefined}
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        onlock?.(node.id, !node.locked);
      }}><Icon name={node.locked ? 'lock' : 'lock-open'} /></Button
    >
  {/if}
{/snippet}

{#snippet item(node: TreeNode, depth: number, parentHidden: boolean)}
  <div class="item" role="none" data-sortable-item data-id={node.id} data-kind={node.kind}>
    {#if hasEnd}
      <TreeRow {...rowProps(node, depth, parentHidden)}>
        {@render body(node)}
        {#snippet end()}{@render tools(node)}{/snippet}
      </TreeRow>
    {:else}
      <TreeRow {...rowProps(node, depth, parentHidden)}>{@render body(node)}</TreeRow>
    {/if}
    {#if node.children && openSet.has(node.id)}
      <div class="zone" role="group" aria-label={node.name} use:sortable={zone(node)}>
        {#each node.children as child (child.id)}
          {@render item(child, depth + 1, parentHidden || !node.visible)}
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

{#snippet add()}
  <Dropdown menu align="end" role="box">
    {#snippet trigger(toggle, open)}
      <Button leading="plus" aria-haspopup="menu" aria-expanded={open} onclick={toggle}
        >{addLabel ?? getMessages().add}</Button
      >
    {/snippet}
    {#snippet panel(close)}
      <MenuList items={addMenu ?? []} onselect={onadd} onclose={close} />
    {/snippet}
  </Dropdown>
{/snippet}

{#snippet tree()}
  <Tree {label}>
    <div class="zone" role="none" use:sortable={zone(null)}>
      {#each nodes as node (node.id)}
        {@render item(node, 0, false)}
      {/each}
    </div>
  </Tree>
{/snippet}

<div class="layer-tree" bind:this={root} use:keys>
  {#if head}
    <SectionHeader {label} flush actions={addMenu ? add : undefined}>{@render tree()}</SectionHeader>
  {:else}
    {@render tree()}
  {/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // Only holds the tree; the distances belong to the SectionHeader and the rows
  .layer-tree,
  .item,
  .zone {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: none;
  }
  // The input of a rename takes the width of the name
  .rename {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
