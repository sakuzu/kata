<script lang="ts" module>
  /** The band of the window's width: wide (64rem and more), mid (48 to 64rem) or narrow */
  export type ShellWidth = 'wide' | 'mid' | 'narrow';
  /** Where a side region is: beside the stage, floating over it, or a sheet from the bottom */
  export type ShellMode = 'beside' | 'floating' | 'sheet';
  /** What onlayout reports */
  export interface ShellLayout {
    width: ShellWidth;
    leftMode: ShellMode;
    rightMode: ShellMode;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick, untrack } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { createNarrow, WIDTHS } from '../lib/viewport.svelte.js';
  import { getMessages } from '../messages.js';
  import Floating from './Floating.svelte';
  import Sheet from './Sheet.svelte';
  import Veil from './Veil.svelte';

  // Shell: the frame of a drawing application. The bar at the top, a region on the left and one on
  // the right, the stage (the drawing surface) in the middle, the toolbar over the bottom of the
  // stage, and a dock under it. Every region is a snippet and any may be absent; the shell knows
  // nothing of what they hold.
  //
  // The side regions follow the three widths. From 64rem they stand beside the stage, with a strong
  // line between. From 48 to 64rem they float over the stage (Floating, gap-md from its edges) over
  // a scrim that closes them when pressed. Below 48rem they are Sheets from the bottom of the stage
  // and the toolbar rises to stay above them. leftOpen and rightOpen open and close them; onlayout
  // reports the width and where each region is.
  //
  //   <Shell bind:leftOpen>
  //     {#snippet top()}<Topbar …/>{/snippet}
  //     {#snippet left()}<Panel label="Contents">…</Panel>{/snippet}
  //     {#snippet stage()}<canvas …></canvas>{/snippet}
  //     {#snippet bottom()}<Drawbar …/>{/snippet}
  //   </Shell>
  type Side = 'left' | 'right';
  let {
    leftOpen = $bindable(true),
    rightOpen = $bindable(false),
    dockHeight = $bindable(),
    leftLabel,
    rightLabel,
    onlayout,
    top,
    left,
    right,
    bottom,
    dock,
    stage,
    veil,
  }: {
    /** Whether the left region shows */
    leftOpen?: boolean;
    /** Whether the right region shows */
    rightOpen?: boolean;
    /** The height of the dock in px; without it, 38.2% of the height under the bar */
    dockHeight?: number;
    /** The names of the sheets that hold the side regions on a narrow screen */
    leftLabel?: string;
    rightLabel?: string;
    /** Called with the width and the place of each side region, and again when they change */
    onlayout?: (layout: ShellLayout) => void;
    /** The bar at the top: a Topbar */
    top?: Snippet;
    /** The left region: a Panel */
    left?: Snippet;
    /** The right region: a Panel */
    right?: Snippet;
    /** The toolbar over the bottom of the stage: a Drawbar */
    bottom?: Snippet;
    /** The dock under the stage: a Panel with side fill */
    dock?: Snippet;
    /** The drawing surface; it fills the rest */
    stage?: Snippet;
    /** While given, a Veil covers the stage and shows it (a loading state) */
    veil?: Snippet;
  } = $props();

  const narrow = createNarrow(WIDTHS.narrow);
  const mid = createNarrow(WIDTHS.mid);
  $effect(narrow.start);
  $effect(mid.start);

  const width: ShellWidth = $derived(narrow.current ? 'narrow' : mid.current ? 'mid' : 'wide');
  const mode: ShellMode = $derived(
    width === 'narrow' ? 'sheet' : width === 'mid' ? 'floating' : 'beside',
  );

  $effect(() => {
    const layout: ShellLayout = { width, leftMode: mode, rightMode: mode };
    untrack(() => onlayout?.(layout));
  });

  // The side regions that are open, in the order they were opened: the last is on top, and
  // Escape closes it first
  let order = $state<Side[]>([]);
  // What had the focus when a pane opened over the stage, to return to when it closes
  const before: Partial<Record<Side, Element | null>> = {};
  function track(side: Side, open: boolean) {
    const rest = order.filter((s) => s !== side);
    if (open && !order.includes(side)) {
      before[side] = typeof document === 'undefined' ? null : document.activeElement;
      order = [...rest, side];
    } else if (!open && order.includes(side)) {
      order = rest;
    }
  }
  $effect(() => {
    const open = leftOpen && !!left;
    untrack(() => track('left', open));
  });
  $effect(() => {
    const open = rightOpen && !!right;
    untrack(() => track('right', open));
  });

  const region = (side: Side) => (side === 'left' ? left : right);
  const shown = (side: Side) => order.includes(side);

  /** Closes a side region, and returns the focus to where it was when the region opened */
  function close(side: Side) {
    if (side === 'left') leftOpen = false;
    else rightOpen = false;
    const back = before[side];
    before[side] = null;
    if (back instanceof HTMLElement && back.isConnected) tick().then(() => back.focus());
  }
  function closeAll() {
    for (const side of [...order].reverse()) close(side);
  }

  // The height of the sheets, which the toolbar rises above
  const sheetH = $state<Record<Side, number>>({ left: 0, right: 0 });
  const lift = $derived(
    mode === 'sheet' ? Math.max(0, ...order.map((side) => sheetH[side])) : 0,
  );
  function measure(side: Side): Attachment<HTMLElement> {
    return (seat) => {
      const sheet = seat.firstElementChild;
      if (!sheet || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => {
        sheetH[side] = sheet.getBoundingClientRect().height;
      });
      ro.observe(sheet);
      return () => {
        ro.disconnect();
        sheetH[side] = 0;
      };
    };
  }
  let sheetStage = $state<Record<Side, 'peek' | 'half' | 'full'>>({ left: 'half', right: 'half' });

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
</script>

{#snippet seat(side: Side)}
  {@render region(side)?.()}
{/snippet}

<div
  class="shell"
  data-role="shell"
  data-width={width}
  style:--kata-shell-lift="{lift}px"
  style:--kata-shell-dock={dockHeight === undefined ? undefined : `${dockHeight}px`}
>
  {#if top}<div class="top">{@render top()}</div>{/if}
  <div class="body">
    {#if mode === 'beside' && shown('left')}
      <div class="side left" data-region="left">{@render seat('left')}</div>
    {/if}
    <div class="main" bind:clientHeight={mainH}>
      <div class="stage" data-region="stage">
        {#if stage}<div class="surface">{@render stage()}</div>{/if}
        {#if bottom}<div class="bottom" data-region="bottom">{@render bottom()}</div>{/if}
        {#if mode === 'floating' && order.length > 0}
          <!-- The scrim is a button that closes the floating panes -->
          <button class="scrim" type="button" aria-label={getMessages().closePanes} onclick={closeAll}
          ></button>
          {#each order as side (side)}
            <Floating
              top="md"
              bottom="md"
              left={side === 'left' ? 'md' : undefined}
              right={side === 'right' ? 'md' : undefined}
            >
              <div class="pane" data-region={side}>{@render seat(side)}</div>
            </Floating>
          {/each}
        {:else if mode === 'sheet'}
          {#each order as side (side)}
            <div class="sheet-seat" data-region={side} {@attach measure(side)}>
              <Sheet
                pane
                closable
                name={side}
                label={side === 'left' ? leftLabel : rightLabel}
                bind:stage={sheetStage[side]}
                onclose={() => close(side)}
              >
                {@render seat(side)}
              </Sheet>
            </div>
          {/each}
        {/if}
        {#if veil}<Veil busy>{@render veil()}</Veil>{/if}
      </div>
      {#if dock}
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
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The shell fills its place; the application gives it the height (the window, usually)
  .shell {
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
  // The scrim is on the floating layer; the order of the elements puts the panes on top
  .scrim {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: color(scrim);
    cursor: pointer;
    z-index: z(floating);
  }
  // A pane floating over the stage: as tall as the Floating around it, and no wider than half the
  // stage, so that two panes keep gap-md between them
  .stage > :global([data-role='floating']) {
    max-width: calc(50% - #{gap(md)} * 1.5);
  }
  .pane {
    display: flex;
    height: 100%;
    min-height: 0;
    > :global(*) {
      flex: 1 1 auto;
      min-height: 0;
    }
  }
  // The frame of a sheet: the stage itself, so that half is half the stage
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
