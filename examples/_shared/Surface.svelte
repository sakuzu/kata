<script lang="ts">
  import type { Snippet } from 'svelte';

  // A plain surface with a line around it, standing in for a panel or a card, so that the edges of
  // the component inside can be seen. width limits it (a length); without it, it fills the row.
  let { width, children }: { width?: string; children: Snippet } = $props();
</script>

<div class="surface" data-role="surface" style:max-width={width}>{@render children()}</div>
