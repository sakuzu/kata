<script lang="ts">
  import type { Snippet } from 'svelte';

  // A container that declares the small button as the height of the controls inside it, as a list
  // item or a toolbar does
  let { children }: { children: Snippet } = $props();
</script>

<div style:--kata-box="var(--kata-height-button-sm)">{@render children()}</div>
