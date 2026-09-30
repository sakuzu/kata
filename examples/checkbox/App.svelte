<script lang="ts">
  import { Checkbox, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="Unchecked, checked, some and disabled">
    <Stack gap={0}>
      <Checkbox label="Share with the team" />
      <Checkbox label="Send a copy to me" checked />
      <Checkbox label="All pages" indeterminate />
      <Checkbox label="Keep the history" disabled />
      <Checkbox label="Required" checked disabled />
    </Stack>
  </Case>
  <Case label="Without text, named by ariaLabel">
    <Checkbox ariaLabel="Select the row" />
  </Case>
</Example>
