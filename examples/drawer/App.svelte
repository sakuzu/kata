<script lang="ts">
  import { Block, Button, Drawer, Row, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(true);
</script>

<!-- TODO(kata): the content of a drawer is a List once the data display family is published -->
{#snippet navigation()}
  <Block>
    <Stack gap="sm">
      <Text role="label">Documents</Text>
      <Text>Recent</Text>
      <Text>Shared with me</Text>
      <Text>Bin</Text>
    </Stack>
  </Block>
{/snippet}

<Example>
  <Case label="Open over its frame: a press on the scrim or Escape closes it">
    <Row><Button onclick={() => (open = true)}>Open the navigation</Button></Row>
    <div class="frame">
      <Block><Text>The content of the frame.</Text></Block>
      <Drawer bind:open label="Navigation">{@render navigation()}</Drawer>
    </div>
  </Case>
  <Case label="The same surface in the flow (inline)">
    <div class="flow">
      <Drawer inline label="Navigation (inline)">{@render navigation()}</Drawer>
    </div>
  </Case>
</Example>

<style>
  /* A positioned frame, as the frame of an application is */
  .frame {
    position: relative;
    height: 20rem;
    overflow: hidden;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  .flow {
    display: flex;
    height: 14rem;
  }
</style>
