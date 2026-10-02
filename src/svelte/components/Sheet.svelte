<script lang="ts" module>
  /** A height of a Sheet: peek (the handle and the head), half (the content's height up to half
   * the frame) or full */
  export type SheetStage = 'peek' | 'half' | 'full';
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';

  // Sheet: a panel that comes up from the bottom of a narrow screen, with a strong line along its
  // top. It has three heights: peek (the handle and the head), half (the content's height up to half
  // the frame; a taller content scrolls) and full. A press on the handle steps up through them (from
  // the highest it returns to the lowest), the arrow keys step up and down, and a drag snaps to the
  // nearest height on release. stages offers fewer heights.
  //
  // The order inside is fixed: the handle, the head, the content and the foot. Only the content
  // shrinks and scrolls. It has no padding. When the content is a panel with a head of its own,
  // pane gives it the full height and the panel's head becomes the sheet's head.
  //
  // It is placed absolutely at the bottom of its frame, which must be a positioned element. inline
  // draws it in the flow instead, for documentation.
  //
  //   <Sheet bind:stage label="Details">
  //     {#snippet head()}…{/snippet}
  //     <Stack gap="md">…</Stack>
  //   </Sheet>
  type Stage = SheetStage;
  let {
    stage = $bindable('half'),
    stages = ['peek', 'half', 'full'],
    onstage,
    name,
    z,
    closable = false,
    onclose,
    pane = false,
    inline = false,
    label,
    head,
    foot,
    children,
  }: {
    /** The height: peek (the head only), half or full */
    stage?: Stage;
    /** The heights offered, lowest first */
    stages?: Stage[];
    /** Called when the height changes */
    onstage?: (stage: Stage) => void;
    /** Tells several sheets apart (data-sheet) */
    name?: string;
    /** The stacking order; the sheet layer by default */
    z?: number;
    /** A drag below the lowest height, or ArrowDown there, closes it */
    closable?: boolean;
    onclose?: () => void;
    /** The content is a panel with its own head and scrolling */
    pane?: boolean;
    /** In the flow of a page, for documentation */
    inline?: boolean;
    /** The accessible name of the sheet */
    label?: string;
    /** The head; it does not shrink */
    head?: Snippet;
    /** The foot, a Footer */
    foot?: Snippet;
    /** The content; it scrolls */
    children: Snippet;
  } = $props();

  // The share of the frame's height of each stage. peek takes the height of its content; its value
  // only guides where a drag snaps.
  const FRAC: Record<Stage, number> = { peek: 0.14, half: 0.5, full: 1 };
  // The least height while dragging, in px
  const MIN_DRAG = 48;

  let el = $state<HTMLElement>();
  // The height in px while dragging; back to a stage on release
  let dragH = $state<number | null>(null);
  let dragging = $state(false);
  let startY = 0;
  let startH = 0;
  let parentH = 0;

  const index = $derived(Math.max(0, stages.indexOf(stage)));

  function go(next: Stage) {
    if (next === stage) return;
    stage = next;
    onstage?.(next);
  }

  function cycle() {
    if (dragging) return;
    go(stages[index >= stages.length - 1 ? 0 : index + 1]);
  }

  function down(e: PointerEvent) {
    if (!el) return;
    parentH = el.parentElement?.clientHeight ?? window.innerHeight;
    startY = e.clientY;
    // Start from the height at the moment of the grab; peek is not a share of the frame
    startH = el.getBoundingClientRect().height;
    dragH = startH;
    dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function move(e: PointerEvent) {
    if (!dragging) return;
    const h = startH + (startY - e.clientY);
    dragH = Math.max(MIN_DRAG, Math.min(parentH * 0.94, h));
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    const frac = (dragH ?? 0) / (parentH || 1);
    dragH = null;
    if (closable && frac < FRAC[stages[0]] * 0.55) {
      onclose?.();
      return;
    }
    let best = stages[0];
    let bestD = Number.POSITIVE_INFINITY;
    for (const s of stages) {
      const d = Math.abs(FRAC[s] - frac);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    go(best);
  }
  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      go(stages[Math.min(stages.length - 1, index + 1)]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (index === 0 && closable) onclose?.();
      else go(stages[Math.max(0, index - 1)]);
    }
  }
</script>

<aside
  class="sheet"
  class:dragging
  data-stage={stage}
  data-inline={inline ? '' : undefined}
  data-sheet={name}
  aria-label={label}
  data-role="panel"
  bind:this={el}
  style:z-index={z}
  style:height={dragH !== null ? `${dragH}px` : undefined}
>
  <!-- The handle: a short bar that steps through the heights and can be dragged -->
  <button
    class="handle"
    type="button"
    aria-label={getMessages().sheetHeight}
    onclick={cycle}
    onpointerdown={down}
    onpointermove={move}
    onpointerup={up}
    onpointercancel={up}
    {onkeydown}
  ></button>
  {@render head?.()}
  <div class="scroll" class:pane>{@render children()}</div>
  {@render foot?.()}
</aside>

<style lang="scss">
  @use '../styles/kata' as *;

  .sheet {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    min-width: 0;
    max-height: 100%;
    background: color(panel);
    color: color(text);
    border-top: bw() solid color(line-strong);
    z-index: z(sheet);
    transition: height 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    @include scope-box(button);
    > :global(*) {
      flex: none;
    }
    > .scroll {
      flex: 1 1 auto;
    }
  }
  // In the flow, with the same heights; its container places it
  aside.sheet[data-inline] {
    position: static;
    flex: none;
  }
  .sheet.dragging {
    transition: none;
  }
  // peek: the height of the handle and the head; the content is hidden
  .sheet[data-stage='peek'] > .scroll:not(.pane) {
    display: none;
  }
  // A panel as content keeps its head at peek; only its scrolling content is hidden
  .sheet[data-stage='peek'] > .scroll.pane :global(.scroll) {
    display: none;
  }
  // half: the content's height up to half the frame; a taller content scrolls there
  .sheet[data-stage='half'] {
    height: auto;
    max-height: 50%;
  }
  .sheet[data-stage='full'] {
    height: 100%;
  }
  .scroll {
    @include bundle;
    min-height: 0;
    min-width: 0;
    overflow: auto;
  }
  .scroll.pane {
    overflow: hidden;
    display: flex;
    > :global(*) {
      flex: 1 1 auto;
      width: 100%;
      max-width: none;
      min-height: 0;
    }
  }
  // The handle is gap-md high; its bar is two gap-md wide and two lines thick
  .handle {
    height: gap(md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: grab;
    touch-action: none;
    &:active {
      cursor: grabbing;
    }
    &::before {
      content: '';
      width: calc(#{gap(md)} * 2);
      height: calc(#{bw()} * 2);
      background: color(line-strong);
    }
  }
</style>
