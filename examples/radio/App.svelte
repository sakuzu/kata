<script lang="ts">
  import { Radio, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let scope = $state('page');
  let share = $state('link');
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
  <Case label="note: a caption under the label, in the column of the text">
    <Stack gap={0}>
      <Radio name="share" value="link" label="Anyone with the link" bind:group={share}>
        {#snippet note()}The link opens it without signing in.{/snippet}
      </Radio>
      <Radio name="share" value="team" label="The team" bind:group={share} />
    </Stack>
  </Case>
</Example>
