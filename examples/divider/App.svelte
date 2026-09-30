<script lang="ts">
  import { Block, Divider, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Between two groups of text">
    <Stack gap="sm">
      <Text>Above the line</Text>
      <Divider />
      <Text>Below the line</Text>
    </Stack>
  </Case>
  <Case label="inset: pad-md free at both ends">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Block><Text>First group</Text></Block>
        <Divider inset />
        <Block><Text>Second group</Text></Block>
      </Stack>
    </Surface>
  </Case>
  <Case label="gap: gap-sm above and below">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Block><Text>First group</Text></Block>
        <Divider gap />
        <Block><Text>Second group</Text></Block>
      </Stack>
    </Surface>
  </Case>
</Example>
