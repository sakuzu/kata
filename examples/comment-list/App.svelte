<script lang="ts">
  import { CommentList, type CommentThread, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let threads = $state<CommentThread[]>([
    {
      id: 't1',
      author: { name: 'Sam Taylor', initial: 'ST', color: '#6f86e6' },
      when: '5 minutes ago',
      body: 'Should the captions sit under the pictures?',
      replies: [
        {
          id: 'r1',
          author: { name: 'Kai Morgan', initial: 'KM', color: '#d9a441' },
          when: '2 minutes ago',
          body: 'Agreed, it reads better.',
        },
      ],
    },
    {
      id: 't2',
      author: { name: 'Ana Ruiz', initial: 'AR' },
      when: 'Yesterday',
      body: 'The arrow points at the wrong door.',
      resolved: true,
    },
  ]);
  let opened = $state('');
</script>

<Example>
  <Case label="Threads with replies: open one, resolve it or reopen it">
    <Surface width="22.5rem">
      <CommentList
        {threads}
        onopen={(id) => (opened = id)}
        onresolve={(id, v) => {
          const t = threads.find((x) => x.id === id);
          if (t) t.resolved = v;
        }}
      />
    </Surface>
    <Text role="caption" muted>Opened: {opened || 'nothing yet'}</Text>
  </Case>
  <Case label="Read only: a resolved thread shows a badge">
    <Surface width="22.5rem">
      <CommentList threads={threads.slice(1)} />
    </Surface>
  </Case>
  <Case label="No threads">
    <Surface width="22.5rem">
      <CommentList threads={[]} />
    </Surface>
  </Case>
</Example>
