<script lang="ts">
  import '../styles/components.css';
  import { tick } from 'svelte';
  import { isMenuItem, type MenuModel, type MenuModelItem } from '../lib/menuModel.js';
  import { follow, placeNext } from '../lib/place.js';
  import { createNarrow, WIDTHS } from '../lib/viewport.svelte.js';
  import Menu from './Menu.svelte';
  import MenuDivider from './MenuDivider.svelte';
  import MenuHead from './MenuHead.svelte';
  import MenuItem from './MenuItem.svelte';
  import MenuList from './MenuList.svelte';

  // MenuList: the items of a menu drawn from its model (MenuModel[]): MenuItem for an item,
  // MenuDivider for a divider and MenuHead for a heading. It goes in a Dropdown with menu, or in a
  // Menu inside an element with role="menu"; AppMenu, MenuSheet, Kebab, Topbar and LayerTree use it.
  //
  // An item with items opens a submenu: on hover or a press, next to its row, in a Menu of its own
  // that moves back inside the window (lib/place) and follows its row while open. On a narrow
  // screen, and with inline, the submenu takes the place of the list instead, under a row that goes
  // back. When one item of a level has checked, the items of that level keep the column of check
  // marks.
  //
  // Keys: the up and down arrows, Home and End move between the items of the level shown (and wrap),
  // the right arrow opens a submenu and moves into it, the left arrow goes back to its parent row.
  //
  //   <Dropdown menu>
  //     {#snippet trigger(toggle, open)}…{/snippet}
  //     {#snippet panel(close)}<MenuList items={menu} onselect={run} onclose={close} />{/snippet}
  //   </Dropdown>
  let {
    items,
    onselect,
    onclose,
    inline = false,
    level = 'root',
    backLabel,
    onexit,
  }: {
    /** The model of the menu */
    items: MenuModel[];
    /** Called with the id of the item that was chosen (not for a link) */
    onselect?: (id: string) => void;
    /** Called after an item was chosen, to close the menu */
    onclose?: () => void;
    /** Submenus take the place of the list at every width (a sheet) */
    inline?: boolean;
    /** Used by the submenus: the root, a submenu next to its row, or one in place */
    level?: 'root' | 'floating' | 'in-place';
    /** Used by the submenus in place: the name of the row that goes back */
    backLabel?: string;
    /** Used by the submenus: goes back to the parent row */
    onexit?: () => void;
  } = $props();

  const narrow = createNarrow(WIDTHS.narrow);
  $effect(narrow.start);
  const inPlace = $derived(inline || narrow.current);

  // The items of this level keep the column of check marks when one of them has a mark
  const hasCheck = $derived(items.some((e) => isMenuItem(e) && e.checked !== undefined));

  // The submenu open next to its row, and the one open in place of the list
  let openSub = $state<number | null>(null);
  let inPlaceSub = $state<number | null>(null);
  let subPos = $state({ top: 0, left: 0 });
  let listEl = $state<HTMLElement>();
  let subEl = $state<HTMLElement>();
  // The row of the submenu open next to it
  let subRow = $state<HTMLElement>();

  // Next to the row, on its right; on its left when there is no room; inside the window below
  function place(row: HTMLElement) {
    subRow = row;
    const r = row.getBoundingClientRect();
    subPos = { top: r.top, left: r.right };
    void tick().then(() => {
      if (!subEl) return;
      subPos = placeNext(subEl, r);
    });
  }
  // While a submenu is open next to its row, it follows the row
  $effect(() => {
    const el = subEl;
    const row = subRow;
    if (!el || !row) return;
    return follow(row, el, () => {
      subPos = placeNext(el, row.getBoundingClientRect());
    });
  });

  function openAt(index: number, row: HTMLElement, focus = false) {
    if (inPlace) inPlaceSub = index;
    else {
      openSub = index;
      place(row);
    }
    if (!focus) return;
    void tick().then(() => {
      const box = inPlace ? listEl : subEl;
      box?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    });
  }

  function toggleAt(index: number, row: HTMLElement) {
    if (inPlace) inPlaceSub = inPlaceSub === index ? null : index;
    else if (openSub === index) openSub = null;
    else openAt(index, row);
  }

  // The rows of this level, in order
  function rows(): HTMLElement[] {
    if (!listEl) return [];
    return [...listEl.querySelectorAll<HTMLElement>(':scope > [role="menuitem"]')];
  }

  // Closes the submenu and returns the focus to its row
  function exitSub() {
    const index = openSub ?? inPlaceSub;
    openSub = null;
    inPlaceSub = null;
    if (index !== null) focusRow(index);
  }

  function focusRow(index: number) {
    void tick().then(() => {
      rows()
        .find((el) => el.getAttribute('data-index') === String(index))
        ?.focus();
    });
  }

  function onkeydown(e: KeyboardEvent) {
    const list = rows();
    const at = list.indexOf(e.target as HTMLElement);
    if (at === -1) return;
    const el = list[at];
    const go = (i: number) => {
      e.preventDefault();
      e.stopPropagation();
      list[((i % list.length) + list.length) % list.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(list.length - 1);
    else if (e.key === 'ArrowRight' && el.getAttribute('aria-haspopup') === 'menu') {
      e.preventDefault();
      e.stopPropagation();
      openAt(Number(el.getAttribute('data-index')), el, true);
    } else if (e.key === 'ArrowLeft' && onexit) {
      e.preventDefault();
      e.stopPropagation();
      onexit();
    }
  }

  function choose(item: MenuModelItem) {
    if (item.disabled) return;
    if (!item.href) onselect?.(item.id);
    onclose?.();
  }

  const floating = $derived(openSub === null ? null : items[openSub]);
  const replaced = $derived(inPlaceSub === null ? null : items[inPlaceSub]);
</script>

{#snippet entries()}
  {#if level === 'in-place' && onexit}
    <MenuItem icon="arrow-left" onclick={() => onexit?.()}>{backLabel}</MenuItem>
    <MenuDivider />
  {/if}
  {#each items as entry, i (i)}
    {#if 'divider' in entry}
      <MenuDivider />
    {:else if 'heading' in entry}
      <MenuHead>{entry.heading}</MenuHead>
    {:else if entry.items}
      <MenuItem
        sub
        icon={entry.icon}
        disabled={entry.disabled}
        on={openSub === i}
        checked={hasCheck ? (entry.checked ?? false) : undefined}
        data-index={i}
        aria-haspopup="menu"
        aria-expanded={openSub === i || inPlaceSub === i}
        onmouseenter={(e: MouseEvent) => {
          if (!inPlace && !entry.disabled) openAt(i, e.currentTarget as HTMLElement);
        }}
        onclick={(e: MouseEvent) => {
          if (!entry.disabled) toggleAt(i, e.currentTarget as HTMLElement);
        }}>{entry.label}</MenuItem
      >
    {:else}
      <MenuItem
        icon={entry.icon}
        kbd={entry.kbd}
        danger={entry.danger}
        disabled={entry.disabled}
        href={entry.href}
        checked={hasCheck ? (entry.checked ?? false) : undefined}
        data-index={i}
        onmouseenter={() => {
          if (!inPlace) openSub = null;
        }}
        onclick={() => choose(entry)}>{entry.label}</MenuItem
      >
    {/if}
  {/each}
{/snippet}

<div
  class="level"
  role={level === 'floating' ? 'menu' : 'group'}
  aria-label={level === 'in-place' ? backLabel : undefined}
  bind:this={listEl}
  {onkeydown}
>
  {#if replaced && !('divider' in replaced) && !('heading' in replaced)}
    <MenuList
      items={replaced.items ?? []}
      level="in-place"
      backLabel={replaced.label}
      {onselect}
      {onclose}
      {inline}
      onexit={exitSub}
    />
  {:else}
    {@render entries()}
  {/if}
</div>

{#if floating && !('divider' in floating) && !('heading' in floating)}
  <div class="sub" bind:this={subEl} style:top={`${subPos.top}px`} style:left={`${subPos.left}px`}>
    <Menu>
      <MenuList
        items={floating.items ?? []}
        level="floating"
        {onselect}
        {onclose}
        onexit={exitSub}
      />
    </Menu>
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // The items of a level, stacked; the surface belongs to the Menu or the Dropdown around them
  .level {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  // A submenu next to its row. It is fixed to the window, so the scrolling place of a Dropdown
  // does not clip it.
  .sub {
    position: fixed;
    z-index: z(menu);
  }
</style>
