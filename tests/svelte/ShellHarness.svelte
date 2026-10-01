<script lang="ts">
  // A Shell with a Pair in its left region and a stage, for the tests of what the shell measures
  import type { ComponentProps } from 'svelte';
  import Pair from '../../src/svelte/components/Pair.svelte';
  import Shell from '../../src/svelte/components/Shell.svelte';

  let props: Omit<ComponentProps<typeof Shell>, 'left' | 'stage'> = $props();
</script>

{#snippet left()}
  <section><Pair label="Name">Hill</Pair></section>
{/snippet}
{#snippet stage()}<div>Drawing</div>{/snippet}

<Shell {...props} {left} {stage} />
