<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Toolbar: the head of a container (a Panel, a modal, a sheet). Its height is fixed: a small
  // button with pad-md above and below, which is what it holds; pad-md at the sides. The title is
  // h2 on one line with an ellipsis, the actions sit at the right end. When the last action is an
  // icon button, tail makes the padding on the right pad-sm, so the icon's strokes line up with the
  // edge of the content below. two lets a title with a second line grow, with pad-md above and
  // below: it is a container with padding, and its text is trimmed at its edges. Without a title the children are free. Tabs inside a Toolbar take its height and meet
  // its line on their own.
  //
  //   <Toolbar title="Contents" rule tail>
  //     {#snippet end()}<Button variant="ghost" icon aria-label="Add"><Icon name="plus" /></Button>{/snippet}
  //   </Toolbar>
  let {
    title,
    titleId,
    rule = false,
    tail = false,
    two = false,
    start,
    end,
    children,
  }: {
    /** The title, h2 on one line */
    title?: string;
    /** The id of the title, for aria-labelledby */
    titleId?: string;
    /** A line along the bottom */
    rule?: boolean;
    /** The last action is an icon button */
    tail?: boolean;
    /** A title with a second line: the height grows with its content */
    two?: boolean;
    /** Before the title (back, close) */
    start?: Snippet;
    /** After the title, at the right end (the actions) */
    end?: Snippet;
    /** Free content, after the title */
    children?: Snippet;
  } = $props();
</script>

<div
  class="bar"
  class:rule
  class:tail
  class:two
  data-role="toolbar"
  data-h={two ? undefined : 'toolbar'}
  data-inset={two ? '' : undefined}
  data-edge-pass={two ? '' : undefined}
>
  {@render start?.()}
  {#if title}<h2 class="title" id={titleId}>{title}</h2>{/if}
  {@render children?.()}
  {#if end}<div class="end">{@render end()}</div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .bar {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(toolbar);
    padding-inline: pad(md);
    flex: none;
    min-width: 0;
    @include text(body);
    @include scope-box(button-sm);
    // Nothing in a toolbar wraps; a long title ends with an ellipsis
    > :global(*) {
      white-space: nowrap;
    }
  }
  .tail {
    padding-inline-end: pad(sm);
  }
  // A title with a second line: a container with padding (data-inset). The height follows the
  // content, pad-md above and below; the items side by side are all at its edges (data-edge-pass),
  // so the first line of the title and the last line under it are trimmed there, and a control
  // without a line or a surface inside reaches into the padding
  .two {
    height: auto;
    min-height: h(toolbar);
    padding-block: pad(md);
    align-items: flex-start;
    --kata-inset: 0px;
    @include edge(1, 1);
  }
  .two .title {
    white-space: normal;
  }
  .rule {
    border-bottom: bw() solid color(line);
  }
  // The title is text in a control: trimmed to its ink and centred
  .title {
    flex: 1;
    @include text(h2);
    margin: 0;
    @include trim;
    @include ellipsis;
  }
  // The actions at the right end. Icon buttons sit side by side; their own area is the distance
  .end {
    display: flex;
    align-items: center;
    gap: 0;
    margin-left: auto;
    flex: none;
  }
</style>
