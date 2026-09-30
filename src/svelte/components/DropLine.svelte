<script lang="ts">
  import '../styles/components.css';

  // DropLine: where a dragged row will land. A blue line, twice the width of a line, between two
  // rows, with a small square at its left end. The element itself has no height; the line is
  // centred on the boundary between the rows, so the rows do not move. In a Tree it is indented to
  // the depth of the place it marks, as a TreeRow of that depth is.
  //
  //   <DropLine depth={1} />
  let {
    depth = 0,
  }: {
    /** The depth of the place, from 0 */
    depth?: number;
  } = $props();
</script>

<div class="drop-line" data-role="rule" style:--kata-tree-depth={depth} aria-hidden="true">
  <span class="bar"><span class="dot"></span></span>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .drop-line {
    position: relative;
    height: 0;
    // The line starts where the content of a row of that depth starts
    padding-left: calc(#{pad(md)} + var(--kata-tree-depth, 0) * #{pad(md)});
    flex: none;
  }
  .bar {
    display: block;
    position: relative;
    height: calc(#{bw()} * 2);
    translate: 0 -50%;
    background: color(blue-ink);
  }
  // The square at the left end, centred on the line
  .dot {
    position: absolute;
    left: 0;
    top: 50%;
    translate: 0 -50%;
    width: gap(xs);
    height: gap(xs);
    background: color(blue-ink);
  }
</style>
