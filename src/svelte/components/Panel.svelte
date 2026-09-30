<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Panel: a container that stacks items reaching its edges (a side column, a left or right panel,
  // a dock). Its order is fixed: head (a Toolbar), content, foot (a Footer). The head and the foot
  // keep their size; only the content shrinks, and it scrolls when it overflows. The content has no
  // padding: lists, trees and section headers reach the edges and are stacked with Stack gap 0,
  // while text and fields go in a Block. The controls inside have a button's height.
  //
  // side: rail (the width of a side column), panel (the width of a panel) or fill (the rest of the
  // row: a dock). fit takes the height of the content only. A dock with resizable shows a grip along
  // its top edge; the grip has no look of its own, only the resize cursor. The panel reports the
  // height asked for with onresize; the application keeps it and applies its limits.
  //
  //   <Panel side="panel">
  //     {#snippet head()}<Toolbar title="Contents" rule tail>…</Toolbar>{/snippet}
  //     <Stack gap={0}><SectionHeader …/><Block>…</Block></Stack>
  //     {#snippet foot()}<Footer>…</Footer>{/snippet}
  //   </Panel>
  let {
    side = 'panel',
    fit = false,
    resizable = false,
    onresize,
    resizeLabel,
    label,
    head,
    foot,
    children,
  }: {
    /** rail and panel are fixed widths; fill takes the rest of the row (a dock) */
    side?: 'rail' | 'panel' | 'fill';
    /** Takes the height of the content only, up to the height of its container */
    fit?: boolean;
    /** A grip along the top edge that changes the height (a dock) */
    resizable?: boolean;
    /** The height asked for by the grip, in px; the application applies its limits */
    onresize?: (height: number) => void;
    /** The name of the grip; required with resizable */
    resizeLabel?: string;
    /** The name of the panel as a region */
    label?: string;
    /** The head, a Toolbar */
    head?: Snippet;
    /** The foot, a Footer, for a panel with a main action */
    foot?: Snippet;
    /** The content; it scrolls when it overflows */
    children: Snippet;
  } = $props();

  // The grip. The panel measures its own height (the application sets it); onresize reports the
  // height asked for. The range it announces is the height of the element that holds the panel's
  // seat.
  let el = $state<HTMLElement>();
  let nowH = $state(0);
  let maxH = $state(0);
  let dragging = false;
  let startY = 0;
  let startH = 0;
  // One press of an arrow key, in px
  const STEP = 32;

  function stageHeight(): number {
    const seat = el?.parentElement;
    return seat?.parentElement?.clientHeight ?? seat?.clientHeight ?? 0;
  }
  $effect(() => {
    if (resizable) maxH = stageHeight();
  });
  function gripDown(e: PointerEvent) {
    maxH = stageHeight();
    startY = e.clientY;
    startH = nowH;
    dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function gripMove(e: PointerEvent) {
    if (!dragging) return;
    onresize?.(startH + (startY - e.clientY));
  }
  function gripUp() {
    dragging = false;
  }
  function gripKey(e: KeyboardEvent) {
    maxH = stageHeight();
    if (e.key === 'ArrowUp') onresize?.(nowH + STEP);
    else if (e.key === 'ArrowDown') onresize?.(nowH - STEP);
    else return;
    e.preventDefault();
  }
</script>

<section
  class="panel"
  data-side={side}
  class:fit
  class:grip={resizable}
  data-role="panel"
  aria-label={label}
  bind:this={el}
  bind:clientHeight={nowH}
>
  {#if resizable}
    <div
      class="handle"
      role="slider"
      tabindex="0"
      aria-label={resizeLabel}
      aria-orientation="vertical"
      aria-valuenow={nowH}
      aria-valuemin={0}
      aria-valuemax={maxH}
      onpointerdown={gripDown}
      onpointermove={gripMove}
      onpointerup={gripUp}
      onpointercancel={gripUp}
      onkeydown={gripKey}
    ></div>
  {/if}
  {@render head?.()}
  <div class="scroll">{@render children()}</div>
  {@render foot?.()}
</section>

<style lang="scss">
  @use '../styles/kata' as *;

  .panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    background: color(panel);
    color: color(text);
    flex: none;
    @include scope-box(button);
    // The head and the foot keep their size
    > :global(*) {
      flex: none;
    }
    // Only the content shrinks
    > .scroll {
      flex: 1 1 auto;
    }
  }
  .grip {
    position: relative;
  }
  // The grip: an area along the top edge without a look; the cursor shows that it can be dragged
  .handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: pad(sm);
    z-index: 1;
    cursor: ns-resize;
    touch-action: none;
    @include focus-inside;
  }
  // The height of the content, never more than the container's
  .fit {
    height: auto;
    max-height: 100%;
    align-self: flex-start;
  }
  .panel[data-side='rail'] {
    width: var(--kata-width-rail);
    max-width: 100%;
  }
  .panel[data-side='panel'] {
    width: var(--kata-width-panel);
    max-width: 100%;
  }
  .panel[data-side='fill'] {
    flex: 1 1 auto;
    width: 100%;
  }
  // The content: the only part that scrolls. No padding: items bring their own, text a Block
  .scroll {
    @include bundle;
    min-height: 0;
    min-width: 0;
    overflow: auto;
  }
</style>
