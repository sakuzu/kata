<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Board: the container of a picker that opens inside a panel (a colour, an emoji, a symbol).
  // It fills the width of its container; the surface is the panel and the line is the strong one,
  // a level above the panel around it. pad-md inside, and the content is a Stack gap md, so a
  // search, a Segmented and Glyphs are just placed in order. The bars of a picker (hue, lightness,
  // a scheme) are the picker's own; Board is the container only. A container to read is a Card.
  //
  //   <Board><SearchInput … /><Glyphs … /></Board>
  let { children }: { children: Snippet } = $props();
</script>

<div class="board" data-inset data-role="card">
  <Stack gap="md">{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .board {
    background: color(panel);
    border: bw() solid color(line-strong);
    @include container;
    min-width: 0;
    @include scope-box(button);
  }
</style>
