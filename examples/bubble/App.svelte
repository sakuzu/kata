<script lang="ts">
  import { Bubble, Button, Divider, Row, Stack, Text, TextInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let reply = $state('');
</script>

<Example>
  <Case label="The surface of a Popover, placed by the caller">
    <Bubble gap="sm">
      <Text>A note pinned to a point of the drawing.</Text>
      <Divider />
      <Text role="caption" muted>The children are a Stack, gap-sm apart.</Text>
    </Bubble>
  </Case>
  <Case label="With a foot that stays in view while the content scrolls">
    <div class="place">
      <Bubble>
        <Stack gap="sm">
          <Text role="label">Ana</Text>
          <Text>Can we move the legend to the left?</Text>
        </Stack>
        <Stack gap="sm">
          <Text role="label">Ken</Text>
          <Text>Yes, and make it smaller.</Text>
        </Stack>
        <Stack gap="sm">
          <Text role="label">Ana</Text>
          <Text>Done. The title moved too.</Text>
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
