<script lang="ts">
  import { Block, Button, Footer, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="cancel and primary">
    <Surface width="35rem">
      <Stack gap={0}>
        <Block><Text>The content of a modal.</Text></Block>
        <Footer>
          {#snippet cancel()}<Button>Cancel</Button>{/snippet}
          {#snippet primary()}<Button variant="primary">Save</Button>{/snippet}
        </Footer>
      </Stack>
    </Surface>
  </Case>
  <Case label="lead, secondary, cancel and primary (stacked when the row does not fit)">
    <Surface width="35rem">
      <Stack gap={0}>
        <Block><Text>The content of a modal.</Text></Block>
        <Footer>
          {#snippet lead()}<Text role="caption" muted>Saved a minute ago</Text>{/snippet}
          {#snippet secondary()}<Button>Save as copy</Button>{/snippet}
          {#snippet cancel()}<Button>Cancel</Button>{/snippet}
          {#snippet primary()}<Button variant="primary">Save</Button>{/snippet}
        </Footer>
      </Stack>
    </Surface>
  </Case>
</Example>
