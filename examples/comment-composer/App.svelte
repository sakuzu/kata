<script lang="ts">
  import { Block, CommentComposer, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let posted = $state<string[]>([]);
</script>

<Example>
  <Case label="Enter posts, Shift+Enter starts a new line; the text is cleared after a post">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <CommentComposer onpost={(text) => void posted.push(text)} />
          {#each posted as p, i (i)}<Text wrap>{p}</Text>{/each}
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="A reply, with its own placeholder and button">
    <Surface width="22.5rem">
      <Block>
        <CommentComposer placeholder="Reply" submitLabel="Send" onpost={() => {}} />
      </Block>
    </Surface>
  </Case>
</Example>
