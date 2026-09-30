<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick, untrack } from 'svelte';

  // Dropdown: a place that opens below a trigger, for a menu or a small picker. It is a popover, so
  // it shows in the top layer, above everything, also when it opens from inside a modal or a panel.
  //
  // With menu, the content is a list of MenuItem: the place wears the surface of a Menu, has
  // role="menu", focuses the first item when it opens, and the arrow keys, Home and End move the
  // focus between the items. With bare, the content brings its own container (a picker, a list).
  //
  // It is placed from the trigger's rectangle: below it, or above when there is no room below, and
  // pushed inside the window at the sides. A press outside, Escape or Tab closes it; Escape and Tab
  // return the focus to the trigger of a menu.
  //
  //   <Dropdown menu>
  //     {#snippet trigger(toggle, open)}
  //       <Button trailing="chevron-down" aria-haspopup="menu" aria-expanded={open} onclick={toggle}>
  //         Sort
  //       </Button>
  //     {/snippet}
  //     {#snippet panel(close)}<MenuItem onclick={close}>Name</MenuItem>{/snippet}
  //   </Dropdown>
  let {
    trigger,
    panel,
    align = 'end',
    openInitially = false,
    menuMaxWidth,
    menu = false,
    bare = false,
    block = false,
    role = 'anchor',
    onOpenChange,
  }: {
    /** The trigger; it receives the toggle function and whether the place is open */
    trigger: Snippet<[() => void, boolean]>;
    /** The content; it receives the close function */
    panel: Snippet<[() => void]>;
    /** The edge of the trigger the place lines up with (it moves back inside the window) */
    align?: 'start' | 'end';
    /** Open from the start */
    openInitially?: boolean;
    /** The widest the place gets (a CSS length); long names end with an ellipsis */
    menuMaxWidth?: string;
    /** The content is a list of MenuItem */
    menu?: boolean;
    /** The content has its own container; the place has no surface */
    bare?: boolean;
    /** The trigger is as wide as its container (a list item) */
    block?: boolean;
    /** The role the trigger's wrapper shows to the layout: box for a control, icon-button for an icon button */
    role?: 'anchor' | 'box' | 'icon-button';
    /** Called whenever the place opens or closes, also by a press outside or Escape */
    onOpenChange?: (open: boolean) => void;
  } = $props();

  let open = $state(untrack(() => openInitially));

  $effect(() => {
    onOpenChange?.(open);
  });

  let anchor = $state<HTMLElement>();
  let panelEl = $state<HTMLElement>();
  let placed = $state(false);
  let pos = $state({ top: 0, left: 0, maxHeight: 0 });
  // Focus the first item once the place shows (menus only)
  let focusFirst = false;
  // Where the focus returns when Escape or Tab closes a menu
  let returnFocusEl: HTMLElement | null = null;

  // The distance from the trigger, the least distance from the window's edge, and the least height
  // below which the place opens on the other side
  const GAP = 4;
  const EDGE = 8;
  const MIN_HEIGHT = 120;

  function place() {
    if (!anchor || !panelEl) return;
    const r = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = panelEl.offsetWidth;
    // The natural height is measured without the limit, or the direction would change each time
    const keep = panelEl.style.maxHeight;
    panelEl.style.maxHeight = '';
    const natural = panelEl.scrollHeight;
    panelEl.style.maxHeight = keep;
    const below = vh - r.bottom - GAP - EDGE;
    const above = r.top - GAP - EDGE;
    const up = below < Math.min(natural, MIN_HEIGHT) && above > below;
    const maxHeight = Math.max(MIN_HEIGHT, up ? above : below);
    const shown = Math.min(natural, maxHeight);
    const top = up ? r.top - GAP - shown : r.bottom + GAP;
    let left = align === 'end' ? r.right - width : r.left;
    left = Math.max(EDGE, Math.min(left, vw - width - EDGE));
    pos = { top: Math.round(top), left: Math.round(left), maxHeight: Math.round(maxHeight) };
  }

  function toggle() {
    open = !open;
    if (open) {
      returnFocusEl = menu ? (document.activeElement as HTMLElement | null) : null;
      focusFirst = menu;
      placed = false;
    }
  }

  function close() {
    open = false;
  }

  // Without the popover API (a test environment) the place is a plain fixed element; the attribute
  // is left out, since [popover] without showPopover() is never shown
  const canPopover =
    typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';

  function isShown(el: HTMLElement): boolean {
    try {
      return el.matches(':popover-open');
    } catch {
      return false;
    }
  }

  // The place is measured once it is open (until then it has no size), and the focus moves once it
  // is visible
  $effect(() => {
    if (!open || !panelEl) return;
    const el = panelEl;
    if (canPopover && !isShown(el)) {
      try {
        el.showPopover();
      } catch {
        // Already open
      }
    }
    void (async () => {
      await tick();
      place();
      placed = true;
      if (!focusFirst) return;
      focusFirst = false;
      await tick();
      focusItemAt(0);
    })();
  });

  function menuItems(): HTMLElement[] {
    if (!panelEl) return [];
    return [...panelEl.querySelectorAll<HTMLElement>('[role="menuitem"]')];
  }
  function focusItemAt(index: number) {
    const items = menuItems();
    if (items.length === 0) return;
    items[((index % items.length) + items.length) % items.length]?.focus();
  }
  function closeAndReturnFocus() {
    open = false;
    returnFocusEl?.focus?.();
  }

  function onMenuKeyDown(e: KeyboardEvent) {
    if (!menu) return;
    const items = menuItems();
    if (items.length === 0) return;
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItemAt(at < 0 ? 0 : at + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItemAt(at < 0 ? items.length - 1 : at - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItemAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItemAt(items.length - 1);
    } else if (e.key === 'Tab') {
      closeAndReturnFocus();
    }
  }

  // A press outside the trigger and the place closes it; read in the capture phase, so that a
  // container that stops propagation does not keep it open
  function onPointerDown(e: PointerEvent) {
    if (!open) return;
    const target = e.target as Node;
    if (anchor?.contains(target) || panelEl?.contains(target)) return;
    open = false;
  }

  // Escape closes the place while it is open and goes no further (a modal around it stays open)
  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !open) return;
    e.stopPropagation();
    if (menu) closeAndReturnFocus();
    else open = false;
  }
</script>

<svelte:window
  onkeydowncapture={onKeyDown}
  onpointerdowncapture={onPointerDown}
  onresize={() => open && place()}
  onscroll={() => open && place()}
/>

<span class="anchor" class:block bind:this={anchor} data-role={role}>
  {@render trigger(toggle, open)}
</span>
{#if open}
  <div
    class="seat"
    class:menu={!bare}
    class:placed
    popover={canPopover ? 'manual' : undefined}
    bind:this={panelEl}
    role={menu ? 'menu' : undefined}
    aria-orientation={menu ? 'vertical' : undefined}
    onkeydown={menu ? onMenuKeyDown : undefined}
    style:top={`${pos.top}px`}
    style:left={`${pos.left}px`}
    style:max-height={`${pos.maxHeight}px`}
    style:max-width={menuMaxWidth}
  >
    {@render panel(close)}
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // Like the control it holds, the trigger does not shrink; it is never wider than its container
  .anchor {
    display: inline-flex;
    max-width: 100%;
    min-width: 0;
  }
  .anchor:not(.block) {
    flex: none;
  }
  .anchor.block {
    display: flex;
    width: 100%;
    > :global(*) {
      flex: 1 1 auto;
      min-width: 0;
    }
  }
  // The place only positions its content; the user agent's look of a popover is removed. It stays
  // hidden until it is placed, so it never flashes at the top of the window.
  .seat {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    overflow: auto;
    visibility: hidden;
    &:popover-open {
      display: flex;
      flex-direction: column;
    }
  }
  .seat.placed {
    visibility: visible;
  }
  // The surface of a menu, the same as Menu
  .menu {
    background: color(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    min-width: min(12rem, calc(100vw - #{gap(md)} * 2));
    max-width: calc(100vw - #{gap(md)} * 2);
  }
</style>
