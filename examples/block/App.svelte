<script lang="ts">
  import { Block, Kbd, Row, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Text in a container without padding">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="sm">
          <Text role="label">Snapping</Text>
          <Text>Points snap to the grid and to the other shapes while you draw.</Text>
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="Text and actions">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="sm">
          <Text>Press <Kbd>⌘K</Kbd> to open the command menu.</Text>
          <Row><DemoButton>Show all</DemoButton></Row>
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="One line: trimmed at both edges">
    <Surface width="22.5rem">
      <Block><Text role="caption">Nothing selected</Text></Block>
    </Surface>
  </Case>
</Example>
