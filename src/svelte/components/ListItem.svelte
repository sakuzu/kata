<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // ListItem: one entry of a list, a roster or a list of notifications. Its height comes from its
  // content: every visible thing in it (a mark, a picture, a control with a line or a surface,
  // stacked content) keeps md above and below, and the item grows to fit. The least height is the
  // ink of its text and md above and below; a list raises it with rows so that items holding
  // different things line up. The author declares no kind.
  //
  // The columns are a grid (columns, as grid-template-columns), gap-sm apart. pad-md at the sides,
  // or the inset its container declares; tail narrows the right side to pad-sm when the item ends
  // with an icon button, so that the icon's strokes line up with the edge of the text. It declares
  // the small button for the controls inside. The hover and selection surfaces, the line and the
  // area that is pressed all belong to this item.
  //
  // Items touch (no gap). rule draws a line under an item, between items only. An item that is
  // pressed takes onclick or href; one that is not takes plain.
  //
  //   <ListItem columns="auto minmax(0, 1fr)" onclick={open}><Icon name="image" /><span>Photos</span></ListItem>
  //   <ListItem columns="minmax(0, 1fr) auto" tail plain><span>Name</span><Button …/></ListItem>
  let {
    columns,
    tail = false,
    sel = false,
    rule = false,
    plain = false,
    href,
    onclick,
    onkeydown,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLElement>, 'class' | 'style' | 'onclick' | 'onkeydown'> & {
    /** The columns of the item's grid (grid-template-columns) */
    columns: string;
    /** The item ends with an icon button: pad-sm at the right */
    tail?: boolean;
    /** Selected: the raise surface and a blue line of two at the left */
    sel?: boolean;
    /** A line under the item (not under the last one) */
    rule?: boolean;
    /** An item that is not pressed: no hover surface */
    plain?: boolean;
    /** Renders a link */
    href?: string;
    /** Makes the item pressable (Enter and Space press it too) */
    onclick?: (e: MouseEvent) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    children: Snippet;
  } = $props();

  const clickable = $derived(!plain && !!(onclick || href));
  function onKeyDown(e: KeyboardEvent) {
    onkeydown?.(e);
    if (e.defaultPrevented) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    // The keys typed into a field inside the item stay the field's
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).click();
  }
</script>

{#if href}
  <a
    class="row"
    class:sel
    class:rule
    class:plain
    class:tail
    data-role="list-item"
    data-h="list-item"
    data-rule={rule ? '' : undefined}
    style:grid-template-columns={columns}
    {href}
    {onclick}
    {onkeydown}
    {...rest}
  >
    {@render children()}
  </a>
{:else}
  <div
    class="row"
    class:sel
    class:rule
    class:plain
    class:tail
    data-role="list-item"
    data-h="list-item"
    data-rule={rule ? '' : undefined}
    style:grid-template-columns={columns}
    {...clickable ? { role: 'button', tabindex: 0 } : {}}
    {onclick}
    onkeydown={clickable ? onKeyDown : onkeydown}
    {...rest}
  >
    {@render children()}
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .row {
    display: grid;
    align-items: center;
    gap: gap(sm);
    // The least height; the content pushes it further. A list or a table raises it with rows
    min-height: var(--kata-list-item-height, #{h(list-item)});
    position: relative;
    // The container decides the padding at the sides: md in one without padding, 0 in one with
    // padding. Without a declaration the item keeps md
    padding-inline: var(--kata-inset, #{pad(md)});
    min-width: 0;
    width: 100%;
    color: inherit;
    text-decoration: none;
    flex: none;
    cursor: default;
    @include text(body);
    @include scope-box(button-sm);
    @include row-content;
    > :global(*) {
      min-width: 0;
    }
    // Bare text in the item is text inside a control: trimmed to its ink, centred and one line
    > :global(:where(span, a, p):not([data-role]):not([data-h])) {
      @include trim;
      @include ellipsis;
    }
    // Items touch, so the focus ring is drawn inside
    @include focus-inside;
  }
  .tail {
    padding-inline-end: pad(sm);
  }
  .row[role='button'],
  a.row {
    cursor: pointer;
    &:hover {
      background: color(raise);
    }
  }
  .sel {
    background: color(raise);
    box-shadow: inset 2px 0 0 color(blue-ink);
  }
  .rule {
    border-bottom: bw() solid color(line);
  }
  .rule:last-child {
    border-bottom: 0;
  }
  .plain,
  .plain:hover {
    cursor: default;
    background: transparent;
  }
  .sel.plain {
    background: color(raise);
  }
</style>
