<script lang="ts">
  import '../styles/components.css';

  // Bars: a histogram. The bins of a sample stand side by side as bars 4rem high at most (the
  // tallest bin fills the height), and the breaks between classes are thin lines over them. It is
  // read for the shape of the distribution, so it has no axis and no figures. The gaps between the
  // bars are transparent lines on their sides: part of the drawing, not a distance of the scale.
  //
  // The inputs next to it tell the values, so the chart is hidden from assistive technology. It
  // cannot be dragged.
  //
  //   <Bars bins={histogram.bins} marks={[1 / 4, 7 / 10]} />
  let {
    bins,
    marks = [],
  }: {
    /** The counts of the bins, from the left */
    bins: number[];
    /** The breaks, as fractions of the width from 0 to 1 */
    marks?: number[];
  } = $props();

  // The tallest bin fills the height; at least 1, so that an empty sample divides by nothing
  const peak = $derived(Math.max(1, ...bins));
</script>

<div class="chart" data-role="bar" aria-hidden="true">
  <div class="bars">
    {#each bins as count, i (i)}
      <i style:height="{(count / peak) * 100}%"></i>
    {/each}
  </div>
  {#each marks as x, i (i)}
    <span class="brk" style:left="{x * 100}%"></span>
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .chart {
    position: relative;
    min-width: 0;
  }
  .bars {
    display: flex;
    align-items: flex-end;
    height: 4rem;
  }
  .bars i {
    flex: 1;
    min-width: 0;
    border-inline: bw() solid transparent;
    background: color(blue-ink);
    background-clip: padding-box;
    opacity: 0.8;
  }
  .brk {
    position: absolute;
    top: 0;
    bottom: 0;
    width: bw();
    background: color(line-strong);
  }
</style>
