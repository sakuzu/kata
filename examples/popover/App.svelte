<script lang="ts">
  import { Button, Divider, Popover, Row, Text, Toggle } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let vertices = $state(true);
  let edges = $state(false);
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
</Example>
