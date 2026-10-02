<script lang="ts">
  // A Topbar whose presence and end write what they receive, for the tests of its compact steps
  import Topbar from '../../src/svelte/components/Topbar.svelte';
</script>

<Topbar brand="Sketchbook">
  {#snippet presence({ compact }: { compact: boolean })}
    <span data-testid="presence">{compact ? 'count' : 'faces'}</span>
  {/snippet}
  {#snippet end({ compact }: { compact: boolean })}
    <span data-testid="end">{compact ? 'kebab' : 'buttons'}</span>
  {/snippet}
</Topbar>
