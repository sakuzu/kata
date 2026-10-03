<script lang="ts">
  import { Block, StepBar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const steps = ['Choose the source', 'Set the range', 'Fetch', 'Review'];
  const ja = ['データ元を選ぶ', '範囲を決める', '取り寄せる', '確かめる'];
</script>

<Example>
  <Case label="The first step">
    <StepBar {steps} current={1} />
  </Case>
  <Case label="Two steps done, the third current">
    <StepBar {steps} current={3} />
  </Case>
  <Case label="In a narrow container">
    <Surface width="18rem"><Block><StepBar {steps} current={2} /></Block></Surface>
  </Case>
  <Case label="Japanese names">
    <StepBar steps={ja} current={2} />
  </Case>
</Example>
