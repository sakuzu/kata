<script lang="ts">
  import { Actions, Button, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
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
</Example>
