<script lang="ts">
  import { Comment, Stack, Text, Thread } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const replies = [
    {
      id: 1,
      name: 'Kai Morgan',
      initial: 'KM',
      time: '2 minutes ago',
      text: 'Agreed, it reads better.',
    },
    {
      id: 2,
      name: 'Ana Ruiz',
      initial: 'AR',
      time: '1 minute ago',
      text: 'I will update the other pages.',
    },
  ];
</script>

<Example>
  <Case label="Replies under a message: a line, then the replies pad-md from it">
    <Surface width="22.5rem">
      <Stack gap="sm">
        <Comment name="Sam Taylor" initial="ST" time="5 minutes ago">
          <Text wrap>Should the captions sit under the pictures?</Text>
        </Comment>
        <Thread>
          {#each replies as r (r.id)}
            <Comment name={r.name} initial={r.initial} time={r.time}><Text wrap>{r.text}</Text></Comment>
          {/each}
        </Thread>
      </Stack>
    </Surface>
  </Case>
</Example>
