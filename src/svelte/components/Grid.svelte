<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Grid: the layout in columns. Choose the number of columns and the gap. Below 64rem three or four
  // columns fold to two, and below 48rem everything folds to one. The columns are minmax(0, 1fr),
  // so the content shrinks instead of overflowing.
  //
  //   <Grid cols={3} gap="md">…</Grid>
  type Gap = 'sm' | 'md' | 'lg';
  let {
    cols = 2,
    gap = 'md',
    children,
  }: {
    /** The number of columns at full width (default 2) */
    cols?: 2 | 3 | 4;
    /** The distance between cells (default md) */
    gap?: Gap;
    children: Snippet;
  } = $props();
</script>

<div class="grid" data-cols={cols} data-gap={gap} data-role="grid">
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: gap(md);
    min-width: 0;
  }
  .grid[data-cols='3'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .grid[data-cols='4'] {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .grid[data-gap='sm'] {
    gap: gap(sm);
  }
  .grid[data-gap='lg'] {
    gap: gap(lg);
  }
  @include mid {
    .grid[data-cols='3'],
    .grid[data-cols='4'] {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @include narrow {
    .grid,
    .grid[data-cols='3'],
    .grid[data-cols='4'] {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
