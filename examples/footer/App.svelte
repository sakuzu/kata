<script lang="ts">
  import { Block, Footer, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="cancel and primary">
    <Surface width="35rem">
      <Stack gap={0}>
        <Block><Text>The content of a modal.</Text></Block>
        <Footer>
          {#snippet cancel()}<DemoButton>Cancel</DemoButton>{/snippet}
          {#snippet primary()}<DemoButton variant="primary">Save</DemoButton>{/snippet}
        </Footer>
      </Stack>
    </Surface>
  </Case>
  <Case label="lead, secondary, cancel and primary (stacked below 48rem)">
    <Surface width="35rem">
      <Stack gap={0}>
        <Block><Text>The content of a modal.</Text></Block>
        <Footer>
          {#snippet lead()}<Text role="caption" muted>Saved a minute ago</Text>{/snippet}
          {#snippet secondary()}<DemoButton>Save as copy</DemoButton>{/snippet}
          {#snippet cancel()}<DemoButton>Cancel</DemoButton>{/snippet}
          {#snippet primary()}<DemoButton variant="primary">Save</DemoButton>{/snippet}
        </Footer>
      </Stack>
    </Surface>
  </Case>
</Example>
