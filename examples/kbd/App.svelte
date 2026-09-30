<script lang="ts">
  import { Kbd, Row, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="With an outline, among words">
    <Row gap="sm"><Text>Open the command menu</Text><Kbd>⌘K</Kbd></Row>
  </Case>
  <Case label="bare, in a column of shortcuts">
    <Stack gap="sm">
      <Row between><Text>Undo</Text><Kbd bare>⌘Z</Kbd></Row>
      <Row between><Text>Redo</Text><Kbd bare>⇧⌘Z</Kbd></Row>
    </Stack>
  </Case>
</Example>
