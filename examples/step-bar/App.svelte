<script lang="ts">
  import { Block, StepBar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const steps = ['Choose the source', 'Set the range', 'Fetch', 'Review'];
</script>

<Example>
  <Case label="The first step">
    <StepBar {steps} current={1} />
  </Case>
  <Case label="Two steps done, the third current">
    <StepBar {steps} current={3} />
  </Case>
  <Case label="It wraps in a narrow container">
    <Surface width="18rem"><Block><StepBar {steps} current={2} /></Block></Surface>
  </Case>
</Example>
