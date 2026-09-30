<script lang="ts">
  import { Stack, Text } from '@sakuzu/kata/svelte';
  import type { Snippet } from 'svelte';

  // One state of a component, with its name above it
  let { label, children }: { label: string; children: Snippet } = $props();
</script>

<Stack gap="sm">
  <Text role="caption" muted>{label}</Text>
  {@render children()}
</Stack>
