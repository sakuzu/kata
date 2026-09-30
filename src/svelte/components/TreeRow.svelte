<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getMessages } from '../messages.js';
  import Icon from './Icon.svelte';
  import ListItem from './ListItem.svelte';

  // TreeRow: one row of a Tree, a ListItem indented by its depth: pad-md plus depth × pad-md on
  // the left. Its columns are fixed: the chevron, the name, the actions. The chevron's place (the
  // square of an icon button) is kept even when the row does not open, so nothing moves when a row
  // gains children; a flat Tree removes it. The chevron is a button of that square.
  //
  // The grip shows on hover and on focus, just left of the first thing the row shows (the chevron,
  // or the name), over the padding, so it takes no place. The actions on the right keep no place:
  // an action in a state other than its default (a hidden eye, a closed lock: data-keep on it)
  // always shows, the others only while the row is hovered or focused (data-open on the row keeps
  // them while a menu of the row is open).
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
    [noSeat ? '' : 'auto', 'minmax(0, 1fr)', end ? 'auto' : ''].filter(Boolean).join(' '),
  );
</script>

<div
  class="tree-row"
  class:hidden
  class:dimmed
  class:dragging
  data-dim={hidden || dimmed || dragging ? '' : undefined}
  style:--kata-tree-depth={depth}
  role="treeitem"
  aria-selected={sel}
  aria-expanded={expandable ? expanded : undefined}
  aria-level={depth + 1}
  {...rest}
>
  <ListItem {columns} {sel} tail={!!end} {onclick} {onkeydown}>
    {#if grip}
      <span class="grip" class:beside={expandable || noSeat} class:show={gripShow} data-grip aria-hidden="true"
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
      <span class="end">{@render end()}</span>
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
  // The grip sits gap-2xs left of the first thing the row shows (the name, over the empty place
  // of the chevron; or the chevron itself, over the padding): placed at that thing's left edge,
  // then moved left by its own width and gap-2xs
  .grip {
    position: absolute;
    top: 50%;
    left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)} + #{h(icon-button)} + #{gap(sm)});
    translate: calc(-100% - #{gap(2xs)}) -50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(icon);
    height: h(icon-button);
    color: color(faint);
    cursor: grab;
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .grip.beside {
    left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)});
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
  // The actions keep no place: they show on hover and focus, and an action marked data-keep always
  .end {
    display: flex;
    align-items: center;
    gap: 0;
    flex: none;
    > :global(*:not([data-keep])) {
      opacity: 0;
    }
  }
  // A mark among the actions does not add to the row's height. The selector outweighs the list
  // item's rule for the content of a row (a class, three attributes and the scope)
  .tree-row .end :global([data-role='mark'][data-h]) {
    margin-block: 0;
  }
  // Where the name would be squeezed, the actions float over its end instead of taking a column
  @include tiny {
    .end {
      position: absolute;
      right: pad(sm);
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .tree-row:hover .end > :global(*),
  .tree-row:focus-within .end > :global(*),
  .tree-row[data-open] .end > :global(*) {
    opacity: 1;
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
