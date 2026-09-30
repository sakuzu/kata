<script lang="ts">
  import { Button, Disclosure, Row, Stack, Text, Toggle } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let snap = $state(true);
  let open = $state(true);
</script>

<Example>
  <Case label="Stacked with gap 0: a line between them; the value shows while closed">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Disclosure title="Grid" value={snap ? 'On' : 'Off'} bind:open>
          <Toggle bind:checked={snap} label="Snap to the grid" />
          <Text>Shapes move in steps of the grid.</Text>
        </Disclosure>
        <Disclosure title="Export" value="3 formats">
          <Row><Button>Export</Button></Row>
        </Disclosure>
        <Disclosure title="Advanced">
          <Text>Settings that are rarely changed.</Text>
        </Disclosure>
      </Stack>
    </Surface>
  </Case>
</Example>
