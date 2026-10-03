<script lang="ts" module>
  import type { IconSource } from '../icons.js';
  import type { SheetStage } from './Sheet.svelte';

  /** The band of the window's width: wide (64rem and more), mid (48 to 64rem) or narrow */
  export type ShellWidth = 'wide' | 'mid' | 'narrow';
  /** Where a side region is: beside the stage, floating over it, or a sheet from the bottom */
  export type ShellMode = 'beside' | 'floating' | 'sheet';
  /** Where the side regions are above the narrow width: floating over the stage, or beside it */
  export type ShellSide = 'floating' | 'beside';
  /** The sheet of a side region on a narrow screen: the heights it offers and whether it closes */
  export interface ShellSheet {
    /** The heights offered, lowest first; all three by default */
    stages?: SheetStage[];
    /** Below the lowest height it closes (the default); with false it stays there */
    closable?: boolean;
  }
  /** A control that opens a closed side region again: its icon and its name */
  export interface ShellReopen {
    icon: IconSource;
    label: string;
  }
  /** The Fab that holds the toolbar on a narrow screen: its names and its icon */
  export interface ShellFab {
    /** The name of the Fab while the toolbar is hidden */
    label: string;
    /** The name of the Fab while the toolbar shows */
    closeLabel: string;
    /** The icon while the toolbar is hidden; plus by default, and x while it shows */
    icon?: IconSource;
  }
  /** The sheet that holds the dock on a narrow screen: its name and the heights it offers */
  export interface ShellDockSheet {
    /** The accessible name of the sheet */
    label: string;
    /** The heights offered, lowest first; half and full by default */
    stages?: SheetStage[];
  }
  /** What onlayout reports */
  export interface ShellLayout {
    width: ShellWidth;
    leftMode: ShellMode;
    rightMode: ShellMode;
    /** From each edge of the stage to the inner edge of the region on that side, in px */
    inset: { top: number; right: number; bottom: number; left: number };
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick, untrack } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import {
    isEditable,
    isHelpKey,
    isMacPlatform,
    matchesAnyShortcut,
    type Shortcut,
  } from '../lib/shortcuts.js';
  import { createNarrow, setAppContainer, WIDTHS } from '../lib/viewport.svelte.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Fab from './Fab.svelte';
  import Floating from './Floating.svelte';
  import Icon from './Icon.svelte';
  import Sheet from './Sheet.svelte';
  import ShortcutsModal from './ShortcutsModal.svelte';
  import Veil from './Veil.svelte';

  // Shell: the frame of a drawing application. The bar at the top, a region on the left and one on
  // the right, the stage (the drawing surface) in the middle, the toolbar over the bottom of the
  // stage, and a dock under it. Every region is a snippet and any may be absent; the shell knows
  // nothing of what they hold.
  //
  // The side regions follow the three widths of the shell's own element, which is the size container
  // `app` of everything inside it (so the container queries of the components in it, and the
  // components that measure in script, read the shell, not the window). From 48rem they float over
  // the stage (Floating, gap-md from its top and its side, a panel wide), both may be open at once,
  // each as tall as its content up to the stage's height less gap-md above and below, and the
  // stage takes the pointer wherever a pane is not. With side="beside" they stand beside the stage
  // from 64rem instead, with a strong line between, and float from 48 to 64rem. Below 48rem they
  // are Sheets from the bottom of the stage and the toolbar rises to stay above them. leftOpen and
  // rightOpen open and close them; onlayout reports the width, where each region is and the inset.
  //
  // The inset is what the regions cover of the stage, in px, from each edge of the stage to the
  // inner edge of the region on that side: left and right are the width of an open side region
  // (beside the stage), or the floating pane's box and the gap-md before it (floating), and 0 for
  // the sheets; a sheet resting at its lowest height does not count. bottom is the height of the
  // sheets the toolbar rises above (the Fab's column is not counted), and top is the floating bar's
  // box and the gap-md above it (topFloating), or 0. The shell measures them with a ResizeObserver
  // (read in the delivery, written in the next frame), calls onlayout when the width, a mode or the
  // inset changes, and sets them on the root as --kata-shell-inset-top, -right, -bottom and -left.
  //
  // On a narrow screen one of the side sheets and the dock is open at a time: opening a side sheet
  // closes the other side and the dock (ondockclose), and the dock's coming closes the side sheets.
  // A sheet that rests at its lowest height (closable: false) does not count as open; it is not
  // shown while the dock's sheet is open, and comes back when the dock closes.
  //
  // shortcuts are attached to the document while the shell is mounted, and the help key (?, Help or
  // F1) opens a ShortcutsModal that lists them. Escape closes the sheet opened last; when none is
  // open (and always while the regions float or stand beside the stage) it goes to onescape. Keys
  // typed into a field, and keys pressed while a modal dialog or a popover is open, belong to them.
  //
  // overlay lays the shell over a drawing surface that belongs to the page: the shell's root lets
  // the pointer through, and only the regions it draws take it.
  //
  // While the bar floats over the stage (topFloating on a narrow screen), the root sets
  // --kata-shell-top to the bar's height plus gap-md, the top inset of the stage: the toolbar's
  // column above the Fab (bottomFab) starts gap-md below it, and scrolls when it does not fit.
  //
  //   <Shell bind:leftOpen shortcuts={keys} onescape={clearSelection}>
  //     {#snippet top()}<Topbar …/>{/snippet}
  //     {#snippet left()}<Panel label="Contents">…</Panel>{/snippet}
  //     {#snippet stage()}<canvas …></canvas>{/snippet}
  //     {#snippet bottom()}<Drawbar …/>{/snippet}
  //   </Shell>
  type Side = 'left' | 'right';
  let {
    side: sides = 'floating',
    narrow: forceNarrow,
    leftOpen = $bindable(true),
    rightOpen = $bindable(false),
    dockHeight = $bindable(),
    shortcutsOpen = $bindable(false),
    shortcuts = [],
    groups,
    overlay = false,
    leftLabel,
    rightLabel,
    leftSheet,
    rightSheet,
    leftStage = $bindable('half'),
    rightStage = $bindable('half'),
    leftReopen,
    rightReopen,
    bottomFab,
    dockSheet,
    ondockclose,
    topFloating = false,
    onlayout,
    onescape,
    top,
    left,
    right,
    bottom,
    dock,
    stage,
    veil,
  }: {
    /** Where the side regions are from 64rem: floating over the stage, or beside it */
    side?: ShellSide;
    /** true: the narrow form (sheets) at any width; false: never; without it, by the width */
    narrow?: boolean;
    /** Whether the left region shows */
    leftOpen?: boolean;
    /** Whether the right region shows */
    rightOpen?: boolean;
    /** The height of the dock in px; without it, 38.2% of the height under the bar */
    dockHeight?: number;
    /** Whether the list of shortcuts is open */
    shortcutsOpen?: boolean;
    /** The keyboard shortcuts, attached while the shell is mounted */
    shortcuts?: Shortcut[];
    /** The order of the groups in the list of shortcuts; by default, as they first appear */
    groups?: string[];
    /** Over a surface of the page: the root lets the pointer through, the regions take it */
    overlay?: boolean;
    /** The names of the sheets that hold the side regions on a narrow screen */
    leftLabel?: string;
    rightLabel?: string;
    /** The heights each side's sheet offers, and whether it closes; a sheet that does not close
     * stays at its lowest height while its region is not open */
    leftSheet?: ShellSheet;
    rightSheet?: ShellSheet;
    /** The height of each side's sheet while its region is open */
    leftStage?: SheetStage;
    rightStage?: SheetStage;
    /** A control in the stage's corner on each side that opens the region again while it is
     * closed, from 48rem */
    leftReopen?: ShellReopen;
    rightReopen?: ShellReopen;
    /** On a narrow screen, the toolbar shows only while this Fab is pressed, in one column above it */
    bottomFab?: ShellFab;
    /** The name and the heights of the Sheet that holds the dock on a narrow screen */
    dockSheet?: ShellDockSheet;
    /** Called when the dock's sheet closes; the application removes the dock */
    ondockclose?: () => void;
    /** On a narrow screen, the bar at the top floats over the stage, which fills the shell */
    topFloating?: boolean;
    /** Called with the width and the place of each side region, and again when they change */
    onlayout?: (layout: ShellLayout) => void;
    /** Escape when no sheet is left to close; returning false leaves the key to the browser */
    onescape?: (e: KeyboardEvent) => unknown;
    /** The bar at the top: a Topbar */
    top?: Snippet;
    /** The left region: a Panel */
    left?: Snippet;
    /** The right region: a Panel */
    right?: Snippet;
    /** The toolbar over the bottom of the stage: a Drawbar; column says to stand it in one column */
    bottom?: Snippet<[{ column: boolean }]>;
    /** The dock under the stage: a Panel with side fill */
    dock?: Snippet;
    /** The drawing surface; it fills the rest */
    stage?: Snippet;
    /** While given, a Veil covers the stage and shows it (a loading state) */
    veil?: Snippet;
  } = $props();

  // The shell measures its own element, and the components inside measure it too
  let root = $state<HTMLElement>();
  setAppContainer({
    get el() {
      return root;
    },
  });
  const below = createNarrow(WIDTHS.narrow);
  const mid = createNarrow(WIDTHS.mid);
  $effect(() => below.start(root));
  $effect(() => mid.start(root));

  // narrow, when given, decides the narrow form instead of the width
  const isNarrow = $derived(forceNarrow ?? below.current);
  const width: ShellWidth = $derived(isNarrow ? 'narrow' : mid.current ? 'mid' : 'wide');
  const mode: ShellMode = $derived(
    width === 'narrow' ? 'sheet' : width === 'wide' && sides === 'beside' ? 'beside' : 'floating',
  );

  // On a narrow screen the dock is always a sheet, at the lowest of its heights at first
  const dockSheeted = $derived(!!dock && mode === 'sheet');
  const DOCK_STAGES: SheetStage[] = ['half', 'full'];
  const dockStages = $derived(dockSheet?.stages ?? DOCK_STAGES);
  let dockStage = $state<SheetStage>();

  // On a narrow screen one sheet at a time. The dock's sheet coming (the dock given, or the screen
  // narrowing with it) closes the side sheets; a sheet that rests was not open and stays. This runs
  // before the side regions are tracked, so that at mount the dock is kept.
  $effect(() => {
    if (!dockSheeted) return;
    untrack(() => {
      leftOpen = false;
      rightOpen = false;
    });
  });

  // The side regions that are open, in the order they were opened: the last sheet is on top, and
  // Escape closes it first
  let order = $state<Side[]>([]);
  // What had the focus when a sheet opened, to return to when it closes
  const before: Partial<Record<Side, Element | null>> = {};
  function track(side: Side, open: boolean) {
    const rest = order.filter((s) => s !== side);
    if (open && !order.includes(side)) {
      before[side] = typeof document === 'undefined' ? null : document.activeElement;
      order = [...rest, side];
      // On a narrow screen, opening a side sheet closes the other side and the dock
      if (mode === 'sheet') {
        if (rest.length > 0) setOpen(rest[0], false);
        if (dockSheeted) ondockclose?.();
      }
    } else if (!open && order.includes(side)) {
      order = rest;
    }
  }
  function setOpen(side: Side, open: boolean) {
    if (side === 'left') leftOpen = open;
    else rightOpen = open;
  }
  $effect(() => {
    const open = leftOpen && !!left;
    untrack(() => track('left', open));
  });
  $effect(() => {
    const open = rightOpen && !!right;
    untrack(() => track('right', open));
  });
  // When the screen narrows with both side regions open, the one opened last stays
  $effect(() => {
    if (mode !== 'sheet') return;
    untrack(() => {
      if (order.length > 1) setOpen(order[0], false);
    });
  });

  const region = (side: Side) => (side === 'left' ? left : right);
  const shown = (side: Side) => order.includes(side);
  const ALL_STAGES: SheetStage[] = ['peek', 'half', 'full'];
  const sheetOf = (side: Side) => (side === 'left' ? leftSheet : rightSheet);
  const stagesOf = (side: Side) => sheetOf(side)?.stages ?? ALL_STAGES;
  const closableOf = (side: Side) => sheetOf(side)?.closable ?? true;
  // The sheets on a narrow screen: those that do not close rest at their lowest height while their
  // region is not open and the dock's sheet is not open, under the open ones, which are on top in
  // the order they were opened
  const sheets = $derived(
    mode === 'sheet'
      ? [
          ...(['left', 'right'] as const).filter(
            (side) => !closableOf(side) && !!region(side) && !shown(side) && !dockSheeted,
          ),
          ...order,
        ]
      : [],
  );
  /** The height a sheet shows: its stage while open, its lowest height while it rests */
  function sheetStage(side: Side): SheetStage {
    if (!shown(side)) return stagesOf(side)[0];
    return side === 'left' ? leftStage : rightStage;
  }
  /** A change of height from the sheet; raising a resting sheet opens its region */
  function setSheetStage(side: Side, next: SheetStage) {
    if (side === 'left') {
      leftStage = next;
      leftOpen = true;
    } else {
      rightStage = next;
      rightOpen = true;
    }
  }
  // The floating panes, the left one first whatever the order they were opened in
  const floating = $derived((['left', 'right'] as const).filter(shown));
  // The controls that open a closed side region again, from 48rem
  const reopenOf = (side: Side) => (side === 'left' ? leftReopen : rightReopen);
  const reopens = $derived(
    mode === 'sheet'
      ? []
      : (['left', 'right'] as const).flatMap((side) => {
          const control = reopenOf(side);
          const open = side === 'left' ? leftOpen : rightOpen;
          return control && region(side) && !open ? [{ side, control }] : [];
        }),
  );
  // On a narrow screen with topFloating, the bar floats over the stage and takes no height
  const topFloats = $derived(topFloating && mode === 'sheet');
  // The height of the floating bar, which the column of the toolbar starts below
  let topH = $state(0);
  // On a narrow screen with bottomFab, the toolbar folds into a Fab and shows while it is pressed
  const folded = $derived(!!bottomFab && mode === 'sheet');
  let fabOpen = $state(false);

  function reopen(side: Side) {
    if (side === 'left') leftOpen = true;
    else rightOpen = true;
  }

  /** Closes a side region, and returns the focus to where it was when the region opened */
  function close(side: Side) {
    if (side === 'left') leftOpen = false;
    else rightOpen = false;
    const back = before[side];
    before[side] = null;
    if (back instanceof HTMLElement && back.isConnected) tick().then(() => back.focus());
  }

  // The height of the sheets, which the toolbar rises above
  const sheetH = $state<Record<Side | 'dock', number>>({ left: 0, right: 0, dock: 0 });
  const lift = $derived(
    mode === 'sheet'
      ? Math.max(0, ...sheets.map((side) => sheetH[side]), dockSheeted ? sheetH.dock : 0)
      : 0,
  );
  function measure(side: Side | 'dock'): Attachment<HTMLElement> {
    return (seat) => {
      const sheet = seat.firstElementChild;
      if (!sheet || typeof ResizeObserver === 'undefined') return;
      // Measured in the next frame, not in the delivery: the toolbar it moves is not delivered again
      // in the same frame
      let frame = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = 0;
          sheetH[side] = sheet.getBoundingClientRect().height;
        });
      });
      ro.observe(sheet);
      return () => {
        ro.disconnect();
        cancelAnimationFrame(frame);
        sheetH[side] = 0;
      };
    };
  }

  // ---- The inset ----
  // The sides from the open regions beside the stage or floating over it, and the top from the
  // floating bar; the bottom is the height of the sheets (lift)
  const sideInset = $state({ left: 0, right: 0 });
  let topInset = $state(0);
  const inset: ShellLayout['inset'] = $derived({
    top: topInset,
    right: sideInset.right,
    bottom: lift,
    left: sideInset.left,
  });
  $effect(() => {
    const el = root;
    // Measured again when the regions over the stage or beside it change
    const at = mode;
    const open = floating;
    const barFloats = topFloats;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const stageEl = el.querySelector<HTMLElement>(':scope > .body > .main > .stage');
    if (!stageEl) return;
    /** The element of a side region: its seat beside the stage, or the box of its floating pane */
    const regionBox = (side: Side): Element | null | undefined =>
      at === 'beside'
        ? el.querySelector(`:scope > .body > .side.${side}`)
        : at === 'floating'
          ? stageEl.querySelector(`:scope > [data-role='floating'] > .pane[data-region='${side}']`)
              ?.parentElement
          : null;
    const barBox = barFloats ? stageEl.querySelector('.top-float')?.parentElement : null;
    let frame = 0;
    const read = () => {
      const stageBox = stageEl.getBoundingClientRect();
      const next = { left: 0, right: 0, top: 0 };
      for (const side of open) {
        const box = regionBox(side)?.getBoundingClientRect();
        if (!box) continue;
        if (at === 'beside') next[side] = box.width;
        else if (side === 'left') next.left = Math.max(0, box.right - stageBox.left);
        else next.right = Math.max(0, stageBox.right - box.left);
      }
      if (barBox) next.top = Math.max(0, barBox.getBoundingClientRect().bottom - stageBox.top);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (sideInset.left !== next.left) sideInset.left = next.left;
        if (sideInset.right !== next.right) sideInset.right = next.right;
        if (topInset !== next.top) topInset = next.top;
      });
    };
    const ro = new ResizeObserver(read);
    for (const target of [el, stageEl, ...open.map(regionBox), barBox])
      if (target) ro.observe(target);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  });

  // Reported at mount, and again when the width, a mode or the inset changes
  $effect(() => {
    const layout: ShellLayout = { width, leftMode: mode, rightMode: mode, inset };
    untrack(() => onlayout?.(layout));
  });

  // ---- The dock's grip ----
  let dockEl = $state<HTMLElement>();
  let mainH = $state(0);
  let dockNow = $state(0);
  let dragging = false;
  let startY = 0;
  let startH = 0;
  // One press of an arrow key, in px (the same as a Panel's grip)
  const STEP = 32;
  /** Keeps the bound height to what the dock shows, after its limits */
  async function settle() {
    await tick();
    if (dockEl) dockHeight = Math.round(dockEl.getBoundingClientRect().height);
  }
  function gripDown(e: PointerEvent) {
    if (!dockEl) return;
    startY = e.clientY;
    startH = dockEl.getBoundingClientRect().height;
    dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function gripMove(e: PointerEvent) {
    if (!dragging) return;
    dockHeight = Math.round(startH + (startY - e.clientY));
  }
  function gripUp() {
    if (!dragging) return;
    dragging = false;
    settle();
  }
  function gripKey(e: KeyboardEvent) {
    const now = dockEl?.getBoundingClientRect().height ?? 0;
    if (e.key === 'ArrowUp') dockHeight = Math.round(now + STEP);
    else if (e.key === 'ArrowDown') dockHeight = Math.round(now - STEP);
    else return;
    e.preventDefault();
    settle();
  }

  // ---- The keys ----
  function modalOpen(): boolean {
    if (document.querySelector('dialog[open]')) return true;
    try {
      return !!document.querySelector(':popover-open');
    } catch {
      return false;
    }
  }
  function onkeydown(e: KeyboardEvent) {
    if (e.defaultPrevented || e.isComposing || shortcutsOpen || modalOpen()) return;
    if (isEditable(e.target) || isEditable(document.activeElement)) return;
    if (e.key === 'Escape' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // Only a sheet closes on Escape; the floating panes stay open, as the panels beside the stage
      const topmost = mode === 'sheet' ? order.at(-1) : undefined;
      if (topmost) {
        e.preventDefault();
        close(topmost);
      } else if (onescape && onescape(e) !== false) {
        e.preventDefault();
      }
      return;
    }
    const mac = isMacPlatform();
    for (const s of shortcuts) {
      if (s.when && !s.when()) continue;
      if (!matchesAnyShortcut(s, e, mac)) continue;
      if (s.run(e) === false) continue;
      e.preventDefault();
      return;
    }
    if (shortcuts.length > 0 && isHelpKey(e)) {
      e.preventDefault();
      shortcutsOpen = true;
    }
  }
</script>

<svelte:document {onkeydown} />

{#snippet seat(side: Side)}
  {@render region(side)?.()}
{/snippet}

<div
  bind:this={root}
  class="shell"
  class:overlay
  data-role="shell"
  data-width={width}
  style:--kata-shell-lift="{lift}px"
  style:--kata-shell-top={topFloats ? `calc(${topH}px + var(--kata-gap-md))` : undefined}
  style:--kata-shell-dock={dockHeight === undefined ? undefined : `${dockHeight}px`}
  style:--kata-shell-inset-top="{inset.top}px"
  style:--kata-shell-inset-right="{inset.right}px"
  style:--kata-shell-inset-bottom="{inset.bottom}px"
  style:--kata-shell-inset-left="{inset.left}px"
>
  {#if top && !topFloats}<div class="top" data-region="top">{@render top()}</div>{/if}
  <div class="body">
    {#if mode === 'beside' && shown('left')}
      <div class="side left" data-region="left">{@render seat('left')}</div>
    {/if}
    <div class="main" bind:clientHeight={mainH}>
      <div class="stage" data-region="stage">
        {#if stage}<div class="surface">{@render stage()}</div>{/if}
        {#if bottom && !folded}
          <div class="bottom" data-region="bottom">{@render bottom({ column: false })}</div>
        {/if}
        {#if bottom && bottomFab && folded}
          {#if fabOpen}
            <div class="fab-column" data-region="bottom">{@render bottom({ column: true })}</div>
          {/if}
          <div class="fab-seat">
            <Fab
              label={fabOpen ? bottomFab.closeLabel : bottomFab.label}
              icon={fabOpen ? 'x' : (bottomFab.icon ?? 'plus')}
              onclick={() => (fabOpen = !fabOpen)}
            />
          </div>
        {/if}
        {#if top && topFloats}
          <div class="top-seat">
            <Floating top="md" left="md" right="md">
              <div class="top-float" data-region="top" bind:offsetHeight={topH}>
                {@render top()}
              </div>
            </Floating>
          </div>
        {/if}
        {#each reopens as { side, control } (side)}
          <div class="reopen">
            <Floating
              top="md"
              left={side === 'left' ? 'md' : undefined}
              right={side === 'right' ? 'md' : undefined}
            >
              <Button variant="ghost" icon aria-label={control.label} onclick={() => reopen(side)}>
                <Icon name={control.icon} />
              </Button>
            </Floating>
          </div>
        {/each}
        {#if mode === 'floating'}
          {#each floating as side (side)}
            <Floating
              top="md"
              left={side === 'left' ? 'md' : undefined}
              right={side === 'right' ? 'md' : undefined}
            >
              <div class="pane" data-region={side}>{@render seat(side)}</div>
            </Floating>
          {/each}
        {:else if mode === 'sheet'}
          {#if dock && dockSheeted}
            <div class="sheet-seat" data-region="dock" {@attach measure('dock')}>
              <Sheet
                pane
                closable
                name="dock"
                label={dockSheet?.label ?? getMessages().dock}
                stages={dockStages}
                bind:stage={() => dockStage ?? dockStages[0], (next) => (dockStage = next)}
                onclose={() => ondockclose?.()}
              >
                {@render dock()}
              </Sheet>
            </div>
          {/if}
          {#each sheets as side (side)}
            <div class="sheet-seat" data-region={side} {@attach measure(side)}>
              <Sheet
                pane
                closable={closableOf(side)}
                stages={stagesOf(side)}
                name={side}
                label={side === 'left' ? leftLabel : rightLabel}
                bind:stage={() => sheetStage(side), (next) => setSheetStage(side, next)}
                onclose={() => close(side)}
              >
                {@render seat(side)}
              </Sheet>
            </div>
          {/each}
        {/if}
        {#if veil}<Veil busy>{@render veil()}</Veil>{/if}
      </div>
      {#if dock && !dockSheeted}
        <div class="dock" data-region="dock" bind:this={dockEl} bind:clientHeight={dockNow}>
          <div
            class="grip"
            role="slider"
            tabindex="0"
            aria-label={getMessages().dockHeight}
            aria-orientation="vertical"
            aria-valuenow={Math.round(dockNow)}
            aria-valuemin={0}
            aria-valuemax={Math.round(mainH)}
            onpointerdown={gripDown}
            onpointermove={gripMove}
            onpointerup={gripUp}
            onpointercancel={gripUp}
            onkeydown={gripKey}
          ></div>
          {@render dock()}
        </div>
      {/if}
    </div>
    {#if mode === 'beside' && shown('right')}
      <div class="side right" data-region="right">{@render seat('right')}</div>
    {/if}
  </div>
  <!-- Inside the root, so that it measures the shell as the components in the regions do -->
  <ShortcutsModal bind:open={shortcutsOpen} {shortcuts} {groups} />
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The shell fills its place; the application gives it the height (the window, usually). It is the
  // size container of the three widths for everything inside it. A size container is not the
  // containing block of fixed elements, so tooltips, menus and popovers inside still place
  // themselves against the window.
  .shell {
    container: app / inline-size;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    color: color(text);
    > .top {
      flex: none;
      min-width: 0;
    }
  }
  .body {
    flex: 1 1 auto;
    display: flex;
    min-height: 0;
    min-width: 0;
  }
  // A side region beside the stage: as tall as the body, a strong line towards the stage
  .side {
    flex: none;
    display: flex;
    min-height: 0;
    max-width: 50%;
    > :global(*) {
      flex: 1 1 auto;
      min-height: 0;
    }
  }
  .side.left {
    border-right: bw() solid color(line-strong);
  }
  .side.right {
    border-left: bw() solid color(line-strong);
  }
  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
  // The stage: the frame of everything that lies over the drawing
  .stage {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }
  .surface {
    position: absolute;
    inset: 0;
  }
  // The toolbar's place: the bottom edge of the stage, or the top of the sheets
  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: var(--kata-shell-lift, 0px);
    height: 0;
  }
  // A pane floating over the stage: a panel wide, and as tall as its content up to the stage's
  // height less gap-md above and below (the dock is under the stage, so it is already left out).
  // It covers nothing more than itself, so the stage takes the pointer around it. At 48rem two
  // panes and the three gaps around them fill the stage exactly.
  .stage > :global([data-role='floating']) {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: var(--kata-width-panel);
    max-width: calc(100% - #{gap(md)} * 2);
    max-height: calc(100% - #{gap(md)} * 2);
  }
  // The Fab's place on a narrow screen: gap-md from the right and from the top of the sheets
  .fab-seat {
    position: absolute;
    left: 0;
    right: 0;
    bottom: var(--kata-shell-lift, 0px);
    height: 0;
  }
  // The toolbar in one column gap-md above the Fab, and gap-md below the top inset (the floating
  // bar, --kata-shell-top). It stands at the bottom of that space, and scrolls when it does not fit
  // (the column Drawbar's own overflow). Only the toolbar takes the pointer, not the space above it
  .fab-column {
    position: absolute;
    z-index: z(floating);
    right: gap(md);
    top: calc(var(--kata-shell-top, 0px) + #{gap(md)});
    bottom: calc(var(--kata-shell-lift, 0px) + #{gap(md)} * 2 + #{h(button)});
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;
    > :global(*) {
      pointer-events: auto;
      min-height: 0;
      max-height: 100%;
    }
  }
  // The seat of the bar floating over the stage: no box of its own, so that its Floating spans the
  // stage less gap-md on each side
  .top-seat {
    display: contents;
  }
  .top-float {
    min-width: 0;
    // The Floating draws the frame, so the bar's own line along its bottom would double it
    > :global([data-role='toolbar']) {
      border-bottom: 0;
    }
  }
  // The seat of a control that opens a closed side again: no box of its own, so that its Floating
  // keeps its own size and places itself against the stage
  .reopen {
    display: contents;
  }
  // The region shrinks with the pane, and what it holds (a Panel) scrolls its own content
  .stage .pane {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    min-height: 0;
    > :global(*) {
      flex: 0 1 auto;
      min-height: 0;
    }
  }
  // The frame of a sheet: the stage itself, so that half is at most half the stage
  .sheet-seat {
    position: absolute;
    inset: 0;
    pointer-events: none;
    > :global(*) {
      pointer-events: auto;
    }
  }
  // The dock: under the stage, at least a toolbar high, and leaving the stage a toolbar at least
  .dock {
    position: relative;
    flex: none;
    display: flex;
    min-height: 0;
    height: clamp(#{h(toolbar)}, var(--kata-shell-dock, 38.2%), calc(100% - #{h(toolbar)}));
    border-top: bw() solid color(line-strong);
    > :global(*) {
      flex: 1 1 auto;
      min-height: 0;
    }
  }
  // Over a surface of the page, the root and the stage let the pointer through to it; every region
  // the shell draws takes it again: the bar, in its place or floating, the side regions, the toolbar
  // and its Fab, the dock, the floating panes and the controls that reopen them, the sheets (their
  // seat already lets it through around them), the veil and the dialog of the shortcuts
  .shell.overlay {
    pointer-events: none;
    > .top,
    > .body > .side,
    > .body > .main > .dock,
    > .body > .main > .stage > .bottom,
    > .body > .main > .stage > .fab-seat,
    > .body > .main > .stage > .fab-column > :global(*),
    > .body > .main > .stage > .reopen,
    > .body > .main > .stage > .top-seat,
    > .body > .main > .stage > :global([data-role='floating']),
    > .body > .main > .stage > :global([data-role='veil']),
    > :global(dialog) {
      pointer-events: auto;
    }
  }
  // The grip along the dock's top edge has no look, only the resize cursor
  .grip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: pad(sm);
    z-index: 1;
    flex: none;
    cursor: ns-resize;
    touch-action: none;
    @include focus-inside;
  }
</style>
