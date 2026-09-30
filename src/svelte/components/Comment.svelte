<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Text from './Text.svelte';

  // Comment: one message of a conversation. Its head is a list item whose height comes from its
  // content: the first line holds the name (one line with an ellipsis) and the actions at the
  // right end, the second line the time (caption), with "(edited)" or the application's own note
  // after it. The name and the time never share a line, so that neither is cut in a narrow column.
  // The body follows below, in the name's column, as text that is not trimmed, with pad-md below.
  // The distance between comments belongs to the Stack or the Thread they are in. At the sides it
  // follows the list items: pad-md in a container without padding, none in a container with
  // padding.
  //
  //   <Comment name="Sam Taylor" time="3 minutes ago">
  //     {#snippet actions()}<Button variant="ghost" icon aria-label="Actions">…</Button>{/snippet}
  //     <Text>The body.</Text>
  //   </Comment>
  //
  // TODO(kata): an initial prop and the person's Avatar in a first column, centred on the first
  // line, with the body under the name, once Avatar is in kata.
  let {
    name,
    time,
    edited,
    actions,
    children,
  }: {
    /** The name of the person who wrote it */
    name: string;
    /** When it was written, as the application words it */
    time?: string;
    /** A note after the time, such as "(edited)" */
    edited?: string;
    /** The actions on the right of the name */
    actions?: Snippet;
    /** The body */
    children: Snippet;
  } = $props();
</script>

<article class="post" data-role="comment">
  <div class="head" data-role="list-item" data-h="list-item">
    <span class="line">
      <span class="name"><Text as="span" clamp>{name}</Text></span>
      {#if actions}<span class="acts">{@render actions()}</span>{/if}
    </span>
    {#if time}<span class="time"
        ><Text role="caption" as="span" clamp>{edited ? `${time} ${edited}` : time}</Text></span
      >{/if}
  </div>
  <div class="body" data-pass>{@render children()}</div>
</article>

<style lang="scss">
  @use '../styles/kata' as *;

  .post {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    min-width: 0;
    padding-inline: var(--kata-inset, #{pad(md)});
    @include scope-box(button-sm);
  }
  // The head: the name and the actions on the first line, the time on the second, pad-md above
  // and below
  .head {
    display: grid;
    align-items: start;
    min-height: h(list-item);
    min-width: 0;
    padding-block: pad(md);
    @include text(body);
  }
  // The first line has the height of an icon button; the name shrinks, the actions keep their size
  .line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: gap(sm);
    min-width: 0;
    min-height: h(icon-button);
  }
  .name {
    display: flex;
    min-width: 0;
    > :global(*) {
      min-width: 0;
    }
  }
  .acts {
    display: flex;
    align-items: center;
    gap: 0;
    flex: none;
  }
  .time {
    display: flex;
    min-width: 0;
  }
  // The body, with pad-md below, the lower half of the rhythm of list items
  .body {
    min-width: 0;
    padding-bottom: pad(md);
  }
</style>
