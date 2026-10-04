<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Avatar from './Avatar.svelte';
  import Text from './Text.svelte';

  // Comment: one message of a conversation. Its head is a list item that is not pressed, whose
  // height comes from its content, with pad-md above and below: the person's Avatar (the small
  // one) in the first column, in a seat centred on the ink of the first line; the first line holds
  // the name (one line with an ellipsis) and the actions at the right end, as tall as the taller of
  // them, the second line the time (caption), with "(edited)" or the application's own
  // note after it. The name and the time never share a line, so that neither is cut in a narrow
  // column. The body follows below, in the name's column, as text, with pad-md below; that padding
  // is the comment's edge, so its last line is trimmed there.
  // color gives the Avatar the person's color, as in a Presence.
  //
  // The distance between comments belongs to the Stack or the Thread they are in. Its padding
  // above and below is the distance to the edge, so it sits in a container without padding, as a
  // list item does, with pad-md at the sides.
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
    /** The person's color, on their Avatar (a CSS color) */
    color?: string;
    /** The actions on the right of the name */
    actions?: Snippet;
    /** The body */
    children: Snippet;
  } = $props();
</script>

<article class="post" data-role="comment">
  <div class="head" data-role="list-item" data-h="list-item">
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
  <div class="body">{@render children()}</div>
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
    // Its own padding above and below is the distance to the edge, so nothing inside it is at the
    // edge of what holds it (a list item stops the flags by its height)
    @include edge(0, 0);
    // The comment takes the inset, so its content takes none
    > * {
      --kata-inset: 0px;
    }
  }
  // The head: the avatar, then the name and the actions on the first line and the time on the
  // second, pad-md above and below. Its columns are the comment's, so the body lines up with the
  // name. It is a list item that is not pressed: the least height of the list's items, and the
  // text inside trimmed to its ink as in a control
  .head {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: subgrid;
    // The avatar's seat and the first line align by their first baseline
    align-items: baseline;
    min-height: var(--kata-list-item-height, #{h(list-item)});
    min-width: 0;
    padding-block: pad(md);
    @include text(body);
  }
  // The avatar's seat: the avatar's height, with the baseline of a trimmed line centred in it, so
  // the avatar is centred on the ink of the first line
  .who {
    @include seat(h(badge));
  }
  // The name and the time are a title and its caption: gap-sm apart, both trimmed
  .main {
    display: grid;
    row-gap: gap(sm);
    min-width: 0;
  }
  // The first line: the name takes the room the actions leave, and the actions keep their size;
  // when they do not fit beside the name, they move below it as a whole
  .line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: gap(sm);
    min-width: 0;
  }
  .name {
    display: flex;
    flex: 1 1 0;
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
    margin-left: auto;
  }
  .time {
    display: flex;
    min-width: 0;
  }
  // The body, with pad-md below, the lower half of the rhythm of list items. That padding is the
  // comment's edge, so the last line of the body is trimmed there
  .body {
    grid-column: 2;
    min-width: 0;
    padding-bottom: pad(md);
    @include edge(0, 1);
  }
</style>
