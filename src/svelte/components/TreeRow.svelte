<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getMessages } from '../messages.js';
  import Icon from './Icon.svelte';
  import ListItem from './ListItem.svelte';

  // TreeRow: one row of a Tree, a ListItem indented by its depth: pad-md plus depth × pad-md on
  // the left. Its columns are fixed: the chevron, the name, the actions that are kept. The
  // chevron's place (the square of an icon button) is kept even when the row does not open, so
  // nothing moves when a row gains children; a flat Tree removes it. The chevron is a button of
  // that square.
  //
  // The grip shows on hover and on focus, just left of the first thing the row shows (the chevron,
  // or the name), over the padding, so it takes no place; beside a chevron at depth 0, where the
  // padding is too narrow, it lies pad-xs from the edge over the chevron's column. Of the actions on the right, only those
  // in a state other than their default (a hidden eye, a closed lock: data-keep on them) keep a
  // place: they always show, at the right end, and take their own width from the name. The others
  // keep no place: while the row is hovered or focused (or has data-open, which the row sets while
  // a menu of the row is open: kata-menu-toggle from a Dropdown) they show over the end of the
  // row, gap-sm before the kept ones, on an opaque ground (the panel under the row's own surface).
  //
  // States: sel (selected: a double blue line on the left and the raise surface), hidden (the row
  // hides its content: dimmed), dimmed (a parent is hidden), dragging (the row is being dragged).
  // Attributes other than the props (data-id, data-kind, data-sortable-item for sortable) go to
  // the row. The right and left arrow keys open and close a row that has the focus.
  //
  //   <TreeRow depth={1} expandable bind:expanded sel onclick={pick}>
  //     Background
  //     {#snippet end()}<Button variant="ghost" icon aria-label="Hide"><Icon name={Eye} /></Button>{/snippet}
  //   </TreeRow>
  let {
    depth = 0,
    expandable = false,
    expanded = $bindable(false),
    ontoggle,
    grip = true,
    gripShow = false,
    sel = false,
    hidden = false,
    dimmed = false,
    dragging = false,
    onclick,
    children,
    end,
    ...rest
  }: Omit<HTMLAttributes<HTMLElement>, 'class' | 'style' | 'onclick' | 'ontoggle' | 'hidden'> & {
    /** The depth, from 0 */
    depth?: number;
    /** The row has children and shows the chevron */
    expandable?: boolean;
    /** The children show */
    expanded?: boolean;
    /** Called with the new state when the chevron is pressed */
    ontoggle?: (expanded: boolean) => void;
    /** Shows the grip (false in a tree that is not reordered) */
    grip?: boolean;
    /** Always shows the grip (screens without hover) */
    gripShow?: boolean;
    /** Selected */
    sel?: boolean;
    /** The row hides its content */
    hidden?: boolean;
    /** A parent is hidden */
    dimmed?: boolean;
    /** The row is being dragged */
    dragging?: boolean;
    /** Called when the row is pressed */
    onclick?: (e: MouseEvent) => void;
    /** The name, and a mark before it */
    children: Snippet;
    /** The actions on the right */
    end?: Snippet;
  } = $props();
  const flatTree = getContext<(() => boolean) | undefined>('kata-tree-flat');
  const noSeat = $derived(!!flatTree?.() && !expandable);

  // The width of the actions that are kept (data-keep), which the row keeps for them. It is read
  // when the actions change size, when one is added or removed and when one is marked or unmarked,
  // and written in the next animation frame
  let endEl = $state<HTMLElement>();
  let keepW = $state(0);
  $effect(() => {
    const el = endEl;
    if (!el) return;
    const read = () => {
      let w = 0;
      for (const c of el.children)
        if (c.hasAttribute('data-keep')) w += c.getBoundingClientRect().width;
      return w;
    };
    keepW = read();
    let frame = 0;
    const update = () => {
      const w = read();
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (w !== keepW) keepW = w;
      });
    };
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    ro?.observe(el);
    const mo = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(update);
    mo?.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-keep'],
    });
    return () => {
      ro?.disconnect();
      mo?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  });

  // A menu of the row (a Dropdown, a Kebab or a Popover among its actions) tells the row when it
  // opens and closes (kata-menu-toggle); while one is open, the row has data-open and keeps its
  // actions shown, though the pointer leaves the row for the menu
  let rowEl = $state<HTMLElement>();
  let menuOpen = $state(false);
  $effect(() => {
    const el = rowEl;
    if (!el) return;
    const from = new Set<EventTarget>();
    const onMenuToggle = (e: Event) => {
      const target = e.target;
      if (!target) return;
      if ((e as CustomEvent<{ open: boolean }>).detail?.open) from.add(target);
      else from.delete(target);
      menuOpen = from.size > 0;
    };
    el.addEventListener('kata-menu-toggle', onMenuToggle);
    return () => el.removeEventListener('kata-menu-toggle', onMenuToggle);
  });

  function toggle() {
    expanded = !expanded;
    ontoggle?.(expanded);
  }
  // The arrow keys open and close the row (Enter and Space press it, as ListItem does)
  function onkeydown(e: KeyboardEvent) {
    const t = e.target as HTMLElement;
    if (t !== e.currentTarget && !t.classList.contains('chev')) return;
    if (!expandable) return;
    if ((e.key === 'ArrowRight' && !expanded) || (e.key === 'ArrowLeft' && expanded)) {
      e.preventDefault();
      toggle();
    }
  }
  const columns = $derived(
    [noSeat ? '' : 'auto', 'minmax(0, 1fr)', keepW > 0 ? 'auto' : ''].filter(Boolean).join(' '),
  );
</script>

<div
  class="tree-row"
  class:pressable={!!onclick}
  class:hidden
  class:dimmed
  class:dragging
  data-dim={hidden || dimmed || dragging ? '' : undefined}
  data-open={menuOpen ? '' : undefined}
  style:--kata-tree-depth={depth}
  role="treeitem"
  aria-selected={sel}
  aria-expanded={expandable ? expanded : undefined}
  aria-level={depth + 1}
  {...rest}
  bind:this={rowEl}
>
  <ListItem {columns} {sel} tail={!!end} {onclick} {onkeydown}>
    {#if grip}
      <span
        class="grip"
        class:beside={expandable || noSeat}
        class:top={depth === 0}
        class:show={gripShow}
        data-grip
        aria-hidden="true"
        ><Icon name="grip-vertical" /></span
      >
    {/if}
    {#if expandable}
      <button
        class="chev"
        type="button"
        data-h="icon-button"
        tabindex={onclick ? -1 : 0}
        aria-label={expanded ? getMessages().collapse : getMessages().expand}
        onclick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
      </button>
    {:else if !noSeat}
      <span class="seat" aria-hidden="true"></span>
    {/if}
    <span class="main">{@render children()}</span>
    {#if end}
      {#if keepW > 0}<span class="keep-seat" style:width="{keepW}px" aria-hidden="true"></span>{/if}
      <span class="end" class:kept={keepW > 0} bind:this={endEl}>{@render end()}</span>
    {/if}
  </ListItem>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .tree-row {
    min-width: 0;
    flex: none;
  }
  // The list item, indented by the depth; it holds the grip
  .tree-row > :global([data-role='list-item']) {
    padding-left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)});
  }
  // The chevron's place, the square of an icon button, kept when the row does not open
  .seat {
    width: h(icon-button);
    flex: none;
  }
  // The grip sits just left of the first thing the row shows: over the empty place of the chevron
  // (its left edge at the place's width plus pad-sm), or over the padding before the chevron (its
  // left edge at the chevron's). Its box is pad-md wide with the icon centred, moved left from that
  // edge by the icon and pad-2xs
  .grip {
    position: absolute;
    top: 50%;
    left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)} + #{h(icon-button)} + #{pad(sm)});
    translate: calc(-1 * (#{h(icon)} + #{pad(2xs)})) -50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: pad(md);
    height: h(icon-button);
    color: color(faint);
    cursor: grab;
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .grip.beside {
    left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)});
  }
  // At depth 0 the padding before the chevron is narrower than the grip: the grip lies pad-xs from
  // the edge, inside the focus ring, over the chevron's column, and shows only on hover and focus
  // as the others do
  .grip.beside.top {
    left: pad(xs);
    translate: 0 -50%;
  }
  .tree-row:hover .grip,
  .tree-row:focus-within .grip,
  .grip.show {
    opacity: 1;
  }
  // The chevron: a button of the icon button's square
  .chev {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(icon-button);
    height: h(icon-button);
    flex: none;
    border: 0;
    padding: 0;
    background: transparent;
    color: color(muted);
    cursor: pointer;
    &:hover {
      background: color(raise-2);
      color: color(text);
    }
    @include focus-inside;
  }
  // The name: text in a control, one line, trimmed to its ink and clipped by the list item (a Text
  // with clamp inside ends with an ellipsis)
  .main {
    display: flex;
    align-items: center;
    gap: gap(sm);
  }
  // Stacked content (a name and a second line) takes the width and may wrap its own text
  .main > :global([data-role='stack']) {
    flex: 1 1 auto;
    min-width: 0;
    white-space: normal;
  }
  // The place the row keeps for the kept actions, as wide as they are
  .keep-seat {
    display: block;
    flex: none;
  }
  // The actions lie over the end of the row, at its right padding, so they take no place of their
  // own; the seat keeps the place of the kept ones, which come last. The others show only on hover
  // and focus, gap-sm before the kept ones, on the panel under the row's own surface
  .end {
    position: absolute;
    right: pad(sm);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0;
    pointer-events: none;
    > :global(*) {
      opacity: 0;
    }
    > :global([data-keep]) {
      order: 2;
      opacity: 1;
      pointer-events: auto;
    }
  }
  // gap-sm between the others and the kept ones
  .end.kept::after {
    content: '';
    order: 1;
    flex: none;
    width: gap(sm);
  }
  .tree-row:hover .end,
  .tree-row:focus-within .end,
  .tree-row[data-open] .end {
    background-color: color(panel);
    > :global(*) {
      opacity: 1;
      pointer-events: auto;
    }
  }
  .tree-row.pressable:hover .end,
  .tree-row[aria-selected='true']:focus-within .end,
  .tree-row[aria-selected='true'][data-open] .end {
    background-image: linear-gradient(#{color(raise)}, #{color(raise)});
  }
  // A mark among the actions does not add to the row's height. The selector outweighs the list
  // item's rule for the content of a row (a class, three attributes and the scope)
  .tree-row .end :global([data-role='mark'][data-h]) {
    margin-block: 0;
  }
  .hidden,
  .dimmed,
  .dragging {
    opacity: dim();
  }
  // While a drag is going on (sortable), the place where the row would drop is outlined in blue
  // and the row that was picked up keeps the stronger surface
  :global(.sortghost) > .tree-row > :global([data-role='list-item']),
  .tree-row:global(.sortghost) > :global([data-role='list-item']) {
    background: color(raise-2);
    box-shadow: inset 0 0 0 calc(#{bw()} * 2) color(blue-ink);
  }
  :global(.sortchosen) > .tree-row > :global([data-role='list-item']),
  .tree-row:global(.sortchosen) > :global([data-role='list-item']) {
    background: color(raise-2);
  }
</style>
