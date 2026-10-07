<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Board: the container of a picker that opens inside a panel (a color, an emoji, a symbol).
  // It fills the width of its container; the surface is the panel and the line is the strong one,
  // a level above the panel around it. pad-md inside, and the content is a Stack gap md, so a
  // search, a Segmented and Glyphs are just placed in order. The bars of a picker (hue, lightness,
  // a scheme) are the picker's own; Board is the container only. A container to read is a Card.
  // In a slot that draws the surface and the line (bare), it keeps only its padding, so that no
  // line is drawn twice.
  //
  // flush drops the padding and keeps the surface and the line (with bare, only the padding goes).
  // The content stacks with gap 0 and reaches the edges, as in a Panel: lists, trees and Disclosure
  // go in directly, while the head, a Segmented, a search, Glyphs and fields go in a Block.
  //
  //   <Board><SearchInput … /><Glyphs … /></Board>
  //   <Board flush><Block>…</Block><List>…</List></Board>
  let {
    bare = false,
    flush = false,
    children,
  }: {
    /** The slot around it draws the surface and the line; the board keeps its padding only */
    bare?: boolean;
    /** No padding and no gap: the content reaches the edges and holds its own */
    flush?: boolean;
    /** The parts of the picker */
    children: Snippet;
  } = $props();
</script>

<div
  class="board"
  class:bare
  class:flush
  data-inset={flush ? undefined : ''}
  data-role={bare ? 'block' : 'card'}
>
  <Stack gap={flush ? 0 : 'md'}>{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .board {
    @include surface(panel);
    border: bw() solid color(line-strong);
    @include container;
    min-width: 0;
    @include scope-box(button);
  }
  // In a slot that draws the surface and the line, only the padding remains
  .board.bare {
    background: none;
    border: 0;
  }
  // The items bring their own padding, as in a Panel; the surface and the line stay
  .board.flush {
    @include bundle;
  }
</style>
