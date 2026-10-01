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
  let openedFolded = $state('');
  // The application words the line under each body: the author, the time and the replies
  const folded = $derived(
    threads.map((t) => ({
      ...t,
      body:
        t.id === 't1'
          ? `${t.body} The captions are under some pictures and beside others, which makes the page hard to read.`
          : t.body,
      byline: t.replies?.length
        ? `${t.author.name} · ${t.when} · ${t.replies.length} reply`
        : undefined,
    })),
  );
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
  <Case label="folded: one row for each thread, which opens it; the body cut at two lines">
    <Surface width="22.5rem">
      <CommentList threads={folded} folded onopen={(id) => (openedFolded = id)} />
    </Surface>
    <Text role="caption" muted>Opened: {openedFolded || 'nothing yet'}</Text>
  </Case>
</Example>
