<script lang="ts">
  import { Block, Bubble, Button, Divider, Row, Stack, Text, TextInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let reply = $state('');
</script>

<Example>
  <Case label="The surface of a Popover, placed by the application">
    <Bubble gap="sm">
      <Text>A note pinned to a point of the stage.</Text>
      <Divider />
      <Text role="caption" muted>The children are a Stack, gap-sm apart.</Text>
    </Bubble>
  </Case>
  <Case label="flush: no padding and no gap; the content holds its own">
    <Bubble flush>
      <Block><Text>A note pinned to a point of the stage.</Text></Block>
      <Divider />
      <Block><Text role="caption" muted>Each Block has its own padding.</Text></Block>
    </Bubble>
  </Case>
  <Case label="With a foot that stays in view while the content scrolls">
    <div class="place">
      <Bubble>
        <Stack gap="sm">
          <Text role="label">Ana</Text>
          <Text>Can we move the arrow to the left?</Text>
        </Stack>
        <Stack gap="sm">
          <Text role="label">Ken</Text>
          <Text>Yes, and make it smaller.</Text>
        </Stack>
        <Stack gap="sm">
          <Text role="label">Ana</Text>
          <Text>Done. The label moved too.</Text>
        </Stack>
        {#snippet foot()}
          <Row gap="sm">
            <TextInput bind:value={reply} aria-label="Reply" placeholder="Reply" />
            <Button variant="primary">Send</Button>
          </Row>
        {/snippet}
      </Bubble>
    </div>
  </Case>
</Example>

<style>
  /* The place decides the greatest height */
  .place {
    display: flex;
    max-height: 16rem;
  }
</style>
