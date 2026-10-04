<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Indent: moves the content that belongs to an expanded list item (a Block, a List) to the right
  // by the item's disclosure column (an icon button and gap-sm), so that it lines up with the
  // item's name. The space on the left is an empty grid column, not padding. The right edge stays
  // where the item's is. Its children reach the edges.
  //
  //   {#if open}<Indent><Block>…</Block></Indent>{/if}
  let { children }: { children: Snippet } = $props();
</script>

<div class="indent" data-role="indent">
  <span class="column" aria-hidden="true"></span>
  <div class="body">{@render children()}</div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .indent {
    display: grid;
    grid-template-columns: h(icon-button) minmax(0, 1fr);
    column-gap: gap(sm);
    min-width: 0;
  }
  .body {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
</style>
