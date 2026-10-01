<script lang="ts" module>
  /** Who wrote a comment */
  export interface CommentAuthor {
    name: string;
    /** The initials in the Avatar, one or two characters */
    initial: string;
    /** The person's color, a CSS color */
    color?: string;
  }

  /** A reply to a thread */
  export interface CommentReply {
    id: string;
    author: CommentAuthor;
    /** When it was written, as the application words it */
    when: string;
    body: string;
  }

  /** A conversation: the first message, its replies and whether it is resolved */
  export interface CommentThread {
    id: string;
    author: CommentAuthor;
    /** When it was written, as the application words it */
    when: string;
    body: string;
    replies?: CommentReply[];
    resolved?: boolean;
    /**
     * The line under the body in the folded form, as the application words it (the author, the
     * time, the number of replies); without it, the author's name · when
     */
    byline?: string;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Avatar from './Avatar.svelte';
  import Badge from './Badge.svelte';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Comment from './Comment.svelte';
  import Divider from './Divider.svelte';
  import Icon from './Icon.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Stack from './Stack.svelte';
  import State from './State.svelte';
  import Text from './Text.svelte';
  import Thread from './Thread.svelte';

  // CommentList: the conversations left on a document, one after another with a line between
  // them. Each is a Comment (the first message) and a Thread of its replies. It knows nothing of
  // where a conversation is on the drawing: the application draws the pins, and opens the place of
  // a conversation when onopen is called.
  //
  // The actions of a thread are on the right of its first message: open (with onopen), and resolve
  // or reopen (with onresolve); a resolved thread that cannot be reopened shows a Resolved badge
  // instead; actions(thread) adds the application's own before them. Without threads it says
  // there are none.
  //
  // folded draws each thread as one ListItem: the Avatar, the body cut at two lines with the
  // byline under it, and a Resolved badge at the right end of a resolved thread. Pressing the item
  // calls onopen; there are no replies and no actions.
  //
  //   <CommentList {threads} onopen={show} onresolve={(id, v) => resolve(id, v)} />
  let {
    threads,
    onopen,
    onresolve,
    label,
    folded = false,
    actions: actionsOf,
  }: {
    /** The conversations, in the order they show */
    threads: CommentThread[];
    /** Shows the open action; called with the id of the thread */
    onopen?: (id: string) => void;
    /** Shows the resolve action; called with the id and the new state */
    onresolve?: (id: string, resolved: boolean) => void;
    /** The name of the list ("Comments" by default) */
    label?: string;
    /** One row for each thread, which opens it when pressed */
    folded?: boolean;
    /** The application's actions of a thread, before resolve and open (a snippet of the thread) */
    actions?: Snippet<[CommentThread]>;
  } = $props();
</script>

{#if threads.length === 0}
  <Block><State text={getMessages().noComments} /></Block>
{:else if folded}
  <List label={label ?? getMessages().comments}>
    {#each threads as t (t.id)}
      <ListItem
        columns="auto minmax(0, 1fr) auto"
        rule
        plain={!onopen}
        onclick={onopen ? () => onopen?.(t.id) : undefined}
        data-resolved={t.resolved ? '' : undefined}
      >
        <div class="who" style:--kata-color-fill={t.author.color} data-kata-datacolor={t.author.color ? '' : undefined}>
          <Avatar initial={t.author.initial} in />
        </div>
        <Stack gap="sm">
          <Text lines={2}>{t.body}</Text>
          <Text role="caption" muted clamp>{t.byline ?? `${t.author.name} · ${t.when}`}</Text>
        </Stack>
        {#if t.resolved}<Badge tone="green">{getMessages().resolved}</Badge>{/if}
      </ListItem>
    {/each}
  </List>
{:else}
  <div class="comment-list" role="list" aria-label={label ?? getMessages().comments}>
    <Stack gap={0}>
      {#each threads as t, i (t.id)}
        {#if i > 0}<Divider />{/if}
        <div class="thread" role="listitem" data-resolved={t.resolved ? '' : undefined}>
          <Stack gap="sm">
            <Comment
              name={t.author.name}
              initial={t.author.initial}
              color={t.author.color}
              time={t.when}
            >
              {#snippet actions()}
                {@render actionsOf?.(t)}
                {#if onresolve}
                  <Button
                    variant="ghost"
                    icon
                    aria-label={t.resolved ? getMessages().reopen : getMessages().resolve}
                    onclick={() => onresolve?.(t.id, !t.resolved)}
                    ><Icon name={t.resolved ? 'undo-2' : 'check'} /></Button
                  >
                {:else if t.resolved}
                  <Badge tone="green">{getMessages().resolved}</Badge>
                {/if}
                {#if onopen}
                  <Button
                    variant="ghost"
                    icon
                    aria-label={getMessages().openThread}
                    onclick={() => onopen?.(t.id)}><Icon name="arrow-up-right" /></Button
                  >
                {/if}
              {/snippet}
              <Text wrap>{t.body}</Text>
            </Comment>
            {#if t.replies?.length}
              <Thread>
                {#each t.replies as r (r.id)}
                  <Comment
                    name={r.author.name}
                    initial={r.author.initial}
                    color={r.author.color}
                    time={r.when}><Text wrap>{r.body}</Text></Comment
                  >
                {/each}
              </Thread>
            {/if}
          </Stack>
        </div>
      {/each}
    </Stack>
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // Only holds the threads; the distances belong to the Comments, the Threads and the lines
  .comment-list,
  .thread {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: none;
  }
  // Only carries the person's color to the Avatar
  .who {
    display: contents;
  }
</style>
