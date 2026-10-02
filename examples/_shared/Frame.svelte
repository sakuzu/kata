<script lang="ts">
  import type { Snippet } from 'svelte';

  // A frame without a look, which gives the component inside the width it has in an application:
  // by default as wide as its content (a menu), and with width (a length) as wide as the row up to
  // that length. It never reaches past the row.
  let { width, children }: { width?: string; children: Snippet } = $props();
</script>

<div
  style:width={width === undefined ? 'max-content' : undefined}
  style:max-width={width === undefined ? '100%' : `min(${width}, 100%)`}
>
  {@render children()}
</div>
