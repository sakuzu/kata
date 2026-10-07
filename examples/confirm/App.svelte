<script lang="ts">
  import {
    Block,
    Button,
    Checkbox,
    Confirm,
    Icon,
    List,
    ListItem,
    Row,
    Stack,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(false);
  let busy = $state(false);
  let result = $state('');
  let understood = $state(false);
  const layers = [
    { name: 'Roads', icon: 'polyline' },
    { name: 'Parcels', icon: 'polygon' },
    { name: 'Wells', icon: 'point' },
  ] as const;

  // The application closes the confirmation when the work is done, and shows busy until then
  function remove() {
    busy = true;
    setTimeout(() => {
      busy = false;
      open = false;
      result = 'Deleted';
    }, 800);
  }
</script>

<Example>
  <Case label="A destructive confirmation (inline): danger-fill">
    <Confirm
      inline
      title="Delete 4 items?"
      message="They move to the bin and are deleted after 30 days."
      confirmLabel="Delete"
      danger
      onconfirm={() => {}}
    />
  </Case>
  <Case label="Any other confirmation: primary, and the default label">
    <Confirm
      inline
      title="Publish this page?"
      message="Anyone with the link can read it."
      onconfirm={() => {}}
    />
  </Case>
  <Case label="A body in place of the message, and disabled until a condition is met">
    <Confirm
      inline
      title="Delete the team?"
      confirmLabel="Delete"
      danger
      disabled={!understood}
      onconfirm={() => {}}
    >
      <Stack gap="sm">
        <Text>Every document of the team is deleted. This cannot be undone.</Text>
        <Checkbox bind:checked={understood} label="I understand" />
      </Stack>
    </Confirm>
  </Case>
  <Case label="flush: the paragraph goes in a Block and a list reaches the edges">
    <Confirm inline flush title="Delete 3 layers?" confirmLabel="Delete" danger onconfirm={() => {}}>
      <Block><Text>These layers and their shapes are deleted.</Text></Block>
      <List label="Layers">
        {#each layers as layer (layer.name)}
          <ListItem columns="auto minmax(0, 1fr)" plain rule>
            <Icon name={layer.icon} /><span>{layer.name}</span>
          </ListItem>
        {/each}
      </List>
    </Confirm>
  </Case>
  <Case label="Over the page: cancel has the first focus; busy while the work runs">
    <Row>
      <Button variant="danger" onclick={() => (open = true)}>Delete…</Button>
      {#if result}<Text role="caption" muted>{result}</Text>{/if}
    </Row>
    <Confirm
      bind:open
      title="Delete this document?"
      message="This cannot be undone."
      confirmLabel="Delete"
      danger
      {busy}
      onconfirm={remove}
      oncancel={() => (result = 'Kept')}
    />
  </Case>
</Example>
