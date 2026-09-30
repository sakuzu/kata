<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Figure: a frame for a picture that draws itself (a canvas, an SVG, an image, a live preview).
  // It has no padding, one line (line color), square corners and no shadow; the picture keeps its
  // own colours and lines, and the frame only gives it an edge. A picture that reaches the edges of
  // the screen (the drawing surface of an editor) has no line and does not go in a Figure.
  //
  //   <Figure height="12rem" label="Preview"><canvas …></canvas></Figure>
  let {
    height,
    label,
    children,
  }: {
    /** The height of the frame as a length ('12rem'); without it the picture sets the height */
    height?: string;
    /** The name of the picture (aria-label); leave it out when the picture names itself */
    label?: string;
    children: Snippet;
  } = $props();
</script>

<div
  class="figure"
  data-role="figure"
  role={label ? 'img' : undefined}
  aria-label={label}
  style:height
>
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .figure {
    border: bw() solid color(line);
    overflow: hidden;
    min-width: 0;
    flex: none;
  }
</style>
