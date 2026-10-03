<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Bulk: the bar of actions on a selection: the number of selected items, a word for them, and the
  // actions at the right end. It is as high as a toolbar, with pad-md at the sides and small buttons
  // inside, on the raise surface with a strong line. When the actions do not fit, the bar scrolls
  // sideways instead of wrapping, and shows its scrollbar.
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

<div class="bulk" data-role="bulk" data-h="toolbar">
  <span class="t n">{count}</span>
  <span class="t">{label}</span>
  <span class="sp"></span>
  {@render actions?.()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .bulk {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(toolbar);
    flex: none;
    padding-inline: pad(md);
    background: color(raise);
    border: bw() solid color(line-strong);
    overflow-x: auto;
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
