<script lang="ts">
  import { Radio, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let scope = $state('page');
</script>

<Example>
  <Case label="On its own, bound to one value">
    <Stack gap={0}>
      <Radio name="scope" value="page" label="This page only" bind:group={scope} />
      <Radio name="scope" value="all" label="All pages" bind:group={scope} />
      <Radio name="scope" value="none" label="Not available" disabled bind:group={scope} />
    </Stack>
  </Case>
  <Case label="With a description">
    <Radio
      name="access"
      value="team"
      label="The team"
      description="Everyone in the team can open and change it."
      group="team"
    />
  </Case>
</Example>
