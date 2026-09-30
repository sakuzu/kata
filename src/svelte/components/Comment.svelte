<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Avatar from './Avatar.svelte';
  import Text from './Text.svelte';

  // Comment: one message of a conversation. Its head takes its height from its content, with
  // pad-md above and below: the person's Avatar (the small one) in the first column, centred on
  // the first line; the first line holds the name (one line with an ellipsis) and the actions at
  // the right end, the second line the time (caption), with "(edited)" or the application's own
  // note after it. The name and the time never share a line, so that neither is cut in a narrow
  // column. The body follows below, in the name's column, as text that is not trimmed, with pad-md
  // below.
  // color gives the Avatar the person's colour, as in a Presence.
  //
  // The distance between comments belongs to the Stack or the Thread they are in. At the sides it
  // follows the list items: pad-md in a container without padding, none in a container with
  // padding.
  //
  //   <Comment name="Sam Taylor" initial="ST" time="3 minutes ago">
  //     {#snippet actions()}<Button variant="ghost" icon aria-label="Actions">…</Button>{/snippet}
  //     <Text>The body.</Text>
  //   </Comment>
  let {
    name,
    initial,
    time,
    edited,
    color,
    actions,
    children,
  }: {
    /** The name of the person who wrote it */
    name: string;
    /** The initials in the person's Avatar, one or two characters */
    initial: string;
    /** When it was written, as the application words it */
    time?: string;
    /** A note after the time, such as "(edited)" */
    edited?: string;
    /** The person's colour, on their Avatar (a CSS colour) */
    color?: string;
    /** The actions on the right of the name */
    actions?: Snippet;
    /** The body */
    children: Snippet;
  } = $props();
</script>

<article class="post" data-role="comment">
  <div class="head">
    <span class="who" style:--kata-color-fill={color} data-kata-datacolor={color ? '' : undefined}
      ><Avatar {initial} in /></span
    >
    <span class="main">
      <span class="line">
        <span class="name"><Text as="span" clamp>{name}</Text></span>
        {#if actions}<span class="acts">{@render actions()}</span>{/if}
      </span>
      {#if time}<span class="time"
          ><Text role="caption" as="span" clamp>{edited ? `${time} ${edited}` : time}</Text></span
        >{/if}
    </span>
  </div>
  <div class="body" data-pass>{@render children()}</div>
</article>

<style lang="scss">
  @use '../styles/kata' as *;

  .post {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: gap(sm);
    min-width: 0;
    padding-inline: var(--kata-inset, #{pad(md)});
    @include scope-box(button-sm);
  }
  // The head: the avatar, then the name and the actions on the first line and the time on the
  // second, pad-md above and below. Its columns are the comment's, so the body lines up with the
  // name
  .head {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: subgrid;
    align-items: start;
    min-height: h(list-item);
    min-width: 0;
    padding-block: pad(md);
    @include text(body);
  }
  // The avatar is centred on the first line
  .who {
    display: flex;
    align-items: center;
    height: h(icon-button);
  }
  .main {
    display: grid;
    min-width: 0;
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
    grid-column: 2;
    min-width: 0;
    padding-bottom: pad(md);
  }
</style>
