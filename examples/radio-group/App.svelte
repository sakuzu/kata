<script lang="ts">
  import { RadioGroup } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const options = [
    { value: 'private', label: 'Only me' },
    { value: 'team', label: 'The team', description: 'Everyone in the team can open it.' },
    { value: 'link', label: 'Anyone with the link', description: 'No account is needed.' },
  ];
  let value = $state('team');
</script>

<Example>
  <Case label="Two to four choices, with descriptions">
    <RadioGroup name="access" {options} bind:value />
  </Case>
  <Case label="Disabled">
    <RadioGroup name="access-off" {options} value="private" disabled />
  </Case>
</Example>
