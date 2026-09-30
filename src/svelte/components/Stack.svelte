<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Stack: the vertical layout, and the only one that holds the distance between its children. The
  // author writes the distance as a gap step (the root times a power of φ); nothing is inferred. A
  // page uses 0, sm, md, lg and xl; 2xs and xs are for the inside of components. The distance runs
  // between the untrimmed line boxes of the children.
  //
  //   <Stack gap="lg">…</Stack>
  //   <Stack gap="sm" align="start">…</Stack>   children keep their own width (marks, badges)
  type Gap = 0 | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  let {
    gap,
    align = 'stretch',
    children,
  }: {
    /** The distance between children */
    gap: Gap;
    /** start keeps each child at its own width instead of the full width */
    align?: 'stretch' | 'start';
    children: Snippet;
  } = $props();
</script>

<div class="stack" data-gap={gap} data-align={align} data-role="stack">
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .stack {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 0;
  }
  .stack[data-align='start'] {
    align-items: flex-start;
  }
  .stack[data-gap='2xs'] {
    gap: gap(2xs);
  }
  .stack[data-gap='xs'] {
    gap: gap(xs);
  }
  .stack[data-gap='sm'] {
    gap: gap(sm);
  }
  .stack[data-gap='md'] {
    gap: gap(md);
  }
  .stack[data-gap='lg'] {
    gap: gap(lg);
  }
  .stack[data-gap='xl'] {
    gap: gap(xl);
  }
  .stack[data-gap='2xl'] {
    gap: gap(2xl);
  }
</style>
