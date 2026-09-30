<script lang="ts">
  import { Kbd, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="gap sm: lines of one group">
    <Stack gap="sm">
      <Text>First line</Text>
      <Text>Second line</Text>
      <Text>Third line</Text>
    </Stack>
  </Case>
  <Case label="gap md: controls stacked">
    <Stack gap="md" align="start">
      <DemoButton>First</DemoButton>
      <DemoButton>Second</DemoButton>
    </Stack>
  </Case>
  <Case label="gap lg: separate topics">
    <Stack gap="lg">
      <Stack gap={0}>
        <Text role="label">Topic one</Text>
        <Text role="caption" muted>A title and a caption, gap 0</Text>
      </Stack>
      <Stack gap={0}>
        <Text role="label">Topic two</Text>
        <Text role="caption" muted>The same pair, gap-lg below the first</Text>
      </Stack>
    </Stack>
  </Case>
  <Case label="align start: marks keep their width">
    <Stack gap="sm" align="start">
      <Kbd>⌘K</Kbd>
      <Kbd>⇧⌘P</Kbd>
    </Stack>
  </Case>
</Example>
