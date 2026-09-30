<script lang="ts">
  import { Stack } from '@sakuzu/kata/svelte';
  import type { Snippet } from 'svelte';

  // The frame of an example page: the cases stacked gap-xl apart. `npm run audit` measures
  // everything inside [data-audit].
  let { children }: { children: Snippet } = $props();
</script>

<main class="example" data-audit>
  <Stack gap="xl">{@render children()}</Stack>
</main>
