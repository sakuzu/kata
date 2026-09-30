<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Row: the horizontal layout. The distance between neighbours is a gap step: 2xs between an icon
  // and its text, sm between controls, lg between groups, 0 between borderless icon buttons (their
  // hit area is the space). Text shrinks and wraps inside its own width while icons, marks and
  // controls keep theirs. A row of controls that may not fit takes wrap and moves whole items to
  // the next line.
  //
  //   <Row gap="sm" between wrap>…</Row>
  type Gap = '0' | '2xs' | 'sm' | 'md' | 'lg';
  let {
    gap = 'sm',
    between = false,
    wrap = false,
    align = 'center',
    justify = 'start',
    children,
  }: {
    /** The distance between items (default sm) */
    gap?: Gap;
    /** Push the first and the last item to the two ends */
    between?: boolean;
    /** Move items that do not fit to the next line */
    wrap?: boolean;
    /** Vertical alignment; stretch fills the height of the row (columns of a frame) */
    align?: 'center' | 'start' | 'end' | 'stretch';
    /** end moves the whole run to the right end */
    justify?: 'start' | 'end';
    children: Snippet;
  } = $props();
</script>

<div
  class="row"
  data-gap={gap}
  data-align={align}
  data-justify={justify}
  class:between
  class:wrap
  data-role="row-inline"
  data-edge-pass
>
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .row {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: gap(sm);
  }
  .row[data-gap='0'] {
    gap: 0;
  }
  .row[data-gap='2xs'] {
    gap: gap(2xs);
  }
  .row[data-gap='md'] {
    gap: gap(md);
  }
  .row[data-gap='lg'] {
    gap: gap(lg);
  }
  .row[data-align='start'] {
    align-items: flex-start;
  }
  .row[data-align='end'] {
    align-items: flex-end;
  }
  .row[data-align='stretch'] {
    align-items: stretch;
    min-height: 0;
  }
  .row[data-justify='end'] {
    justify-content: flex-end;
  }
  .between {
    justify-content: space-between;
  }
  // Marks (thumbnails, avatars, badges) never shrink, so that the text beside them cannot overlap
  .row > :global([data-role='mark']) {
    flex: none;
  }
  // In a row that wraps, items move to the next line whole instead of shrinking
  .wrap {
    flex-wrap: wrap;
    > :global(*) {
      flex-shrink: 0;
      max-width: 100%;
    }
  }
  // A sentence at the end of a row takes the rest of the width (not in a row with two ends)
  .row:not(.between) > :global([data-role='caption']:last-child),
  .row:not(.between) > :global([data-role='p']:last-child) {
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
