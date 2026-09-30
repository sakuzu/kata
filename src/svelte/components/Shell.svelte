<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';
  import { getMessages } from '../messages.js';
  import Veil from './Veil.svelte';

  // Shell: the frame of a drawing application. The bar at the top, a region on the left and one on
  // the right, the stage (the drawing surface) in the middle, the toolbar over the bottom of the
  // stage, and a dock under it. Every region is a snippet and any may be absent; the shell knows
  // nothing of what they hold.
  //
  // The side regions stand beside the stage, with a strong line between; leftOpen and rightOpen
  // open and close them.
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

  const region = (side: Side) => (side === 'left' ? left : right);
  const shown = (side: Side) => (side === 'left' ? leftOpen && !!left : rightOpen && !!right);

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
  style:--kata-shell-dock={dockHeight === undefined ? undefined : `${dockHeight}px`}
>
  {#if top}<div class="top">{@render top()}</div>{/if}
  <div class="body">
    {#if shown('left')}
      <div class="side left" data-region="left">{@render seat('left')}</div>
    {/if}
    <div class="main" bind:clientHeight={mainH}>
      <div class="stage" data-region="stage">
        {#if stage}<div class="surface">{@render stage()}</div>{/if}
        {#if bottom}<div class="bottom" data-region="bottom">{@render bottom()}</div>{/if}
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
    {#if shown('right')}
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
  // The toolbar's place: the bottom edge of the stage
  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
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
