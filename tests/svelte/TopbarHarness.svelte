<script lang="ts">
  // A Topbar whose presence, end and (with search) centre write what they receive, for the tests
  // of its compact steps
  import Topbar from '../../src/svelte/components/Topbar.svelte';

  let { search = false }: { search?: boolean } = $props();
</script>

{#snippet center({ compact }: { compact: boolean })}
  <span data-testid="center">{compact ? 'icon' : 'search'}</span>
{/snippet}

<Topbar brand="Sketchbook" center={search ? center : undefined}>
  {#snippet presence({ compact }: { compact: boolean })}
    <span data-testid="presence">{compact ? 'count' : 'faces'}</span>
  {/snippet}
  {#snippet end({ compact }: { compact: boolean })}
    <span data-testid="end">{compact ? 'kebab' : 'buttons'}</span>
  {/snippet}
</Topbar>
