<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // DropTarget: the place to drop files. One row inside a strong line, with pad-md inside (it holds
  // a button, so the distance is the same on every side) and its items gap-sm apart; it wraps when
  // it does not fit, the lines gap-md apart. While files are over it (over), the line turns blue
  // and the surface raise. The application handles the drag events and the drop; the component
  // shows the place and its two states.
  //
  //   <DropTarget over={dragging}>
  //     <Icon name={Upload} /><span>Drop files here</span>
  //     <Button>Choose files</Button>
  //   </DropTarget>
  let {
    over = false,
    children,
  }: {
    /** Files are being dragged over it */
    over?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="drop" data-inset class:over data-role="drop">
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .drop {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(md) gap(sm);
    border: bw() solid color(line-strong);
    @include container;
    // Only the row wraps, never inside a sentence
    white-space: nowrap;
    flex: none;
    min-width: 0;
    transition:
      background-color 0.12s ease,
      border-color 0.12s ease;
    @include text(body);
    @include scope-box(button);
    // An item wider than the container shrinks and ends its text with an ellipsis
    > :global(*) {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }
  }
  .over {
    border-color: color(blue-ink);
    background: color(raise);
  }
</style>
