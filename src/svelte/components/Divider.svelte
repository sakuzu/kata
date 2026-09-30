<script lang="ts">
  import '../styles/components.css';

  // Divider: one line (line color) that separates roles, never a decoration. It sits between list
  // items with no space around it; the items' own padding is the space. Where a line needs room
  // above and below (inside a popover), gap adds gap-sm on both sides. Sections do not use it; they
  // draw their own line.
  //
  //   <Divider />   <Divider inset />   <Divider gap />
  let {
    inset = false,
    gap = false,
  }: {
    /** Keep pad-md free at both ends */
    inset?: boolean;
    /** Add gap-sm above and below */
    gap?: boolean;
  } = $props();
</script>

<div class="rule" data-role="rule" class:inset class:gap role="separator"></div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The room around the line is padding, and the line is painted inside it only (a component has no
  // outer margin)
  .rule {
    height: bw();
    background: color(line);
    background-clip: content-box;
    flex: none;
  }
  .inset {
    padding-inline: pad(md);
  }
  .gap {
    height: calc(#{bw()} + #{gap(sm)} * 2);
    padding-block: pad(sm);
  }
</style>
