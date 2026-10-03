<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Bulk: the bar of actions on a selection: the number of selected items, a word for them, and the
  // actions at the right end. It is as high as a toolbar, with pad-md at the sides and small buttons
  // inside, on the raise surface with a strong line. When the actions do not fit, the bar scrolls
  // sideways instead of wrapping. The bar is a row inside the region that scrolls, so that the
  // scrollbar adds to its height below it instead of taking room from the buttons.
  //
  //   <Bulk count={n} label="selected">{#snippet actions()}<Button>Move</Button>{/snippet}</Bulk>
  let {
    count,
    label,
    actions,
  }: {
    /** The number of selected items */
    count: number;
    /** The words after the number */
    label: string;
    actions?: Snippet;
  } = $props();
</script>

<div class="bulk" data-role="bulk">
  <div class="bar" data-h="toolbar">
    <span class="t n">{count}</span>
    <span class="t">{label}</span>
    <span class="sp"></span>
    {@render actions?.()}
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The region that scrolls: its height is the bar's, and its scrollbar's below it
  .bulk {
    flex: none;
    overflow-x: auto;
  }
  // The bar: as wide as the region, or as its content when that is wider
  .bar {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(toolbar);
    width: max-content;
    min-width: 100%;
    padding-inline: pad(md);
    background: color(raise);
    border: bw() solid color(line-strong);
    @include text(body);
    @include scope-box(button-sm);
    > :global(*) {
      white-space: nowrap;
    }
  }
  .t {
    display: block;
    @include trim;
  }
  .n {
    font-variant-numeric: tabular-nums;
  }
  .sp {
    flex: 1;
  }
</style>
