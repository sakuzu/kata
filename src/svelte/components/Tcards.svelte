<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Tcards: a column of Tcard that fills its container and scrolls itself, the narrow form of a
  // table that fills its container. For a virtual scroll the spine (the number of rows times the
  // height of one) comes in height, and only the cards in view go in children, each placed at its
  // y. The height of a row belongs to Tcard, so the application measures one card that is
  // rendered. No padding.
  //
  //   <Tcards height="{total * rowHeight}px" bind:el onscroll={onScroll}>
  //     {#each shown as i (i)}<Tcard y={i * rowHeight} role="row">…</Tcard>{/each}
  //   </Tcards>
  let {
    height,
    el = $bindable(),
    onscroll,
    children,
  }: {
    /** The height of the spine (a virtual scroll); without it the height of the content */
    height?: string;
    /** The element that scrolls */
    el?: HTMLElement;
    /** Called when it scrolls */
    onscroll?: (e: Event) => void;
    children: Snippet;
  } = $props();
</script>

<div class="wrap" bind:this={el} {onscroll} data-role="table">
  <div class="rows" style:height>{@render children()}</div>
</div>

<style lang="scss">
  .wrap {
    height: 100%;
    min-width: 0;
    overflow: auto;
  }
  // The cards are placed absolutely on the spine
  .rows {
    position: relative;
  }
</style>
