<script lang="ts">
  import { Block, Button, Drawer, Icon, List, ListItem, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(true);
</script>

{#snippet navigation()}
  <List label="Documents">
    <ListItem columns="auto minmax(0, 1fr)" sel onclick={() => {}}>
      <Icon name="image" /><span>Recent</span>
    </ListItem>
    <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
      <Icon name="share-2" /><span>Shared with me</span>
    </ListItem>
    <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
      <Icon name="trash-2" /><span>Bin</span>
    </ListItem>
  </List>
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
