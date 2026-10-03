<script lang="ts">
  import { Actions, Block, Button, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="secondary and primary at the right end">
    <Actions>
      {#snippet secondary()}<Button>Cancel</Button>{/snippet}
      {#snippet primary()}<Button variant="primary">Save</Button>{/snippet}
    </Actions>
  </Case>
  <Case label="A status at the left end">
    <Actions>
      {#snippet lead()}<Text role="caption" muted>Saved three minutes ago</Text>{/snippet}
      {#snippet secondary()}<Button>Back to draft</Button>{/snippet}
      {#snippet primary()}<Button variant="primary">Publish</Button>{/snippet}
    </Actions>
  </Case>
  <Case label="Three buttons wider than the frame wrap inside the group, at the right end">
    <Surface width="17.5rem">
      <Block>
        <Actions>
          {#snippet secondary()}<Button>Copy the link</Button><Button>Stop sharing</Button>{/snippet}
          {#snippet primary()}<Button variant="primary">Done</Button>{/snippet}
        </Actions>
      </Block>
    </Surface>
  </Case>
</Example>
