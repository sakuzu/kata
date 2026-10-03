<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { createNarrow } from '../lib/viewport.svelte.js';

  // Pair: a name and a value side by side. The name column is 7.5rem wide and muted; gap-sm lies
  // between the name and the value. It has three forms.
  //
  //   edit (the default)  the value is a control; the height is a button's
  //   read                the value is text to read (a summary, the attributes of a thing); the
  //                       height follows the content and the pair is not a control
  //   top                 the value has several lines (a Textarea); aligned at the top
  //
  // The name is trimmed to its ink and level with the first line of the value (with a control,
  // with the text inside it). Edit and read pairs are not mixed in one column. Pairs are gap-sm
  // apart in a Stack; a column of read pairs is a Kv. The pair owns the padding at its sides: the
  // inset its container declares (none inside a container with padding).
  //
  //   <Pair label="Line width"><NumberInput bind:value unit="px" /></Pair>
  //   <Pair read label="Length">13.1 km</Pair>
  //   <Pair read label="ID" mono clamp>ab12…</Pair>
  let {
    label,
    for: htmlFor,
    href,
    read = false,
    top = false,
    note,
    tight = false,
    indent = 0,
    muted = false,
    mono = false,
    clamp = false,
    children,
  }: {
    label: string;
    /** The id of the control the name labels */
    for?: string;
    /** Makes the name a link (a read pair opened by its name, as in a table of contents) */
    href?: string;
    /** A value to read, not a control */
    read?: boolean;
    /** A value of several lines: aligned at the top, the height follows the content */
    top?: boolean;
    /** A caption under the value, gap-xs from it */
    note?: string;
    /** The name column takes the width of its content (a narrow container) */
    tight?: boolean;
    /** The depth of a read name in a tree of values: md × depth */
    indent?: number;
    /** A weaker read value (empty or inherited) */
    muted?: boolean;
    /** The monospace font (identifiers) */
    mono?: boolean;
    /** The value on one line with an ellipsis */
    clamp?: boolean;
    children: Snippet;
  } = $props();
  // Below 24rem the name sits above the value, and the pair no longer has a control's height
  const tiny = createNarrow(24);
  $effect(tiny.start);
  // A read pair has no line and no surface: it is not a control, so it declares no height
  const h = $derived(top || tiny.current || read ? undefined : 'button');
</script>

<div
  class="pair"
  class:read
  class:top
  class:tight
  class:noted={!!note}
  data-role="pair"
  data-h={note ? undefined : h}
>
  {#if htmlFor}
    <label class="k" for={htmlFor} style:--kata-pair-depth={indent}>{label}</label>
  {:else if href}
    <a class="k link" {href} style:--kata-pair-depth={indent}>{label}</a>
  {:else}
    <span class="k" style:--kata-pair-depth={indent}>{label}</span>
  {/if}
  {#if read}
    <span class="v" class:muted class:mono class:clamp>{@render children()}</span>
  {:else}
    <div class="row">{@render children()}</div>
  {/if}
  {#if note}<span class="note">{note}</span>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .pair {
    --kata-pair-name: 7.5rem;
    display: grid;
    // Inside a Kv the pair sits on the Kv's columns (subgrid), so that the names line up
    grid-template-columns: var(--kata-pair-cols, var(--kata-pair-name) minmax(0, 1fr));
    grid-column: 1 / -1;
    align-items: center;
    column-gap: gap(sm);
    min-width: 0;
    flex: none;
    height: box-h();
    // The pair owns the padding at its sides, so that the control never touches the container's
    // edge: the inset of a container without padding, 0 inside one with padding
    padding-inline: inset();
    @include text(body);
  }
  // A read pair has no height; the name is level with the first line of the value
  .read {
    height: auto;
    align-items: baseline;
  }
  .tight {
    grid-template-columns: var(--kata-pair-cols, max-content minmax(0, 1fr));
  }
  // The name: text inside a control, trimmed and centred. Only the depth indents it
  .k {
    display: block;
    color: color(muted);
    padding-inline-start: calc(var(--kata-pair-depth, 0) * #{pad(md)});
    @include trim;
    @include ellipsis;
  }
  .k.link {
    color: color(blue-ink);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  // An edit value fills the column. A value that needs its own width goes in a Row
  .row {
    display: flex;
    align-items: center;
    min-width: 0;
    > :global(*) {
      flex: 1 1 auto;
      min-width: 0;
    }
    // A mark (a swatch, a badge, a thumbnail) keeps its own size and its aspect ratio at the start
    > :global([data-role='mark']) {
      flex: none;
    }
  }
  .v {
    display: block;
    min-width: 0;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
    @include trim;
  }
  .v.muted {
    color: color(muted);
  }
  .mono {
    font-family: var(--kata-font-mono);
  }
  .v.clamp {
    @include ellipsis;
    overflow-wrap: normal;
  }
  // The note: caption, in the color of the text, in the value's column
  .note {
    grid-column: 2;
    @include text(caption);
  }
  // A value of several lines: the name sits at the centre of the first line of the control
  .top {
    align-items: start;
    height: auto;
    .k {
      padding-top: calc((#{box-h()} - 1em * var(--kata-ink)) / 2 + var(--kata-ink-over) * 1em);
    }
  }
  .noted {
    height: auto;
    row-gap: gap(xs);
  }
  // When the name column does not fit, the name sits above the value
  @include tiny {
    .pair {
      grid-template-columns: minmax(0, 1fr);
      align-items: start;
      row-gap: gap(xs);
      height: auto;
    }
    .note {
      grid-column: 1;
    }
  }
</style>
