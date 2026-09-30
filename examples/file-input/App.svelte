<script lang="ts">
  import { Button, FileInput, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let picker = $state<ReturnType<typeof FileInput>>();
  let chosen = $state('No file chosen');
</script>

<Example>
  <Case label="A button opens the chooser; the input itself is hidden">
    <Row wrap>
      <Button leading="plus" onclick={() => picker?.pick()}>Choose images</Button>
      <Text role="caption" muted>{chosen}</Text>
    </Row>
    <FileInput
      bind:this={picker}
      accept="image/*"
      multiple
      onpick={(files) => (chosen = files.map((f) => f.name).join(', '))}
    />
  </Case>
</Example>
