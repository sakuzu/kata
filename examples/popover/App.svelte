<script lang="ts">
  import {
    Block,
    Button,
    Divider,
    Icon,
    List,
    ListItem,
    Popover,
    Row,
    Text,
    Toggle,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let vertices = $state(true);
  let edges = $state(false);
  let shape = $state('Line');
  const shapes = [
    { name: 'Line', icon: 'polyline' },
    { name: 'Area', icon: 'polygon' },
    { name: 'Point', icon: 'point' },
  ] as const;
</script>

<Example>
  <Case label="Open from the start; a press outside, Escape or Tab closes it">
    <Row gap="sm" wrap>
      <Popover openInitially>
        {#snippet anchor(toggle, open)}
          <Button trailing="chevron-down" aria-expanded={open} onclick={toggle}>Snapping</Button>
        {/snippet}
        <Toggle label="To vertices" bind:checked={vertices} between />
        <Toggle label="To edges" bind:checked={edges} between />
        <Divider />
        <Text role="caption" muted>Hold Alt to snap to nothing for a moment.</Text>
      </Popover>
      <Popover align="end" gap="md">
        {#snippet anchor(toggle, open)}
          <Button aria-expanded={open} onclick={toggle}>About the colors</Button>
        {/snippet}
        {#snippet children(close)}
          <Text>Each color is one group of shapes.</Text>
          <Row justify="end"><Button onclick={close}>Close</Button></Row>
        {/snippet}
      </Popover>
    </Row>
  </Case>
  <Case label="flush (press to open): a list reaches the edges; text goes in a Block">
    <Row justify="end">
      <Popover align="end" flush>
        {#snippet anchor(toggle, open)}
          <Button trailing="chevron-down" aria-expanded={open} onclick={toggle}>{shape}</Button>
        {/snippet}
        {#snippet children(close)}
          <Block><Text role="caption" muted>The shape that the next drawing makes.</Text></Block>
          <List label="Shapes">
            {#each shapes as s (s.name)}
              <ListItem
                columns="auto minmax(0, 1fr)"
                sel={shape === s.name}
                aria-current={shape === s.name ? 'true' : undefined}
                onclick={() => {
                  shape = s.name;
                  close();
                }}
              >
                <Icon name={s.icon} /><span>{s.name}</span>
              </ListItem>
            {/each}
          </List>
        {/snippet}
      </Popover>
    </Row>
  </Case>
</Example>
