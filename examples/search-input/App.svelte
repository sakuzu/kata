<script lang="ts">
  import { Block, SearchInput, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let query = $state('');
</script>

<Example>
  <Case label="Empty, with a value, and disabled">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <SearchInput bind:value={query} placeholder="Find a document" label="Search documents" />
          <SearchInput value="plan" label="Search pages" />
          <SearchInput placeholder="Find a member" label="Search members" disabled />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="The small button, declared by the container">
    <Small><SearchInput placeholder="Filter layers" label="Filter layers" /></Small>
  </Case>
</Example>
