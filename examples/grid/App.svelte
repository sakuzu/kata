<script lang="ts">
  import { Grid, Stack, Text, Thumbnail } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const cells = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i + 1}`);
</script>

{#snippet cell(name: string)}
  <Stack gap="sm">
    <Thumbnail size="full" />
    <Text role="caption">{name}</Text>
  </Stack>
{/snippet}

<Example>
  <Case label="cols 2, gap md (default)">
    <Grid>{#each cells(4) as name (name)}{@render cell(name)}{/each}</Grid>
  </Case>
  <Case label="cols 3, gap sm (two columns below 64rem, one below 48rem)">
    <Grid cols={3} gap="sm">{#each cells(6) as name (name)}{@render cell(name)}{/each}</Grid>
  </Case>
  <Case label="cols 4, gap lg">
    <Grid cols={4} gap="lg">{#each cells(8) as name (name)}{@render cell(name)}{/each}</Grid>
  </Case>
</Example>
