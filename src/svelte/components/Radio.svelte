<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Radio: one choice of a group. It is a control of the height of a small button, and the whole
  // control is pressed. The circle sits in the square of an icon; the text on its right is trimmed
  // to its ink and centred. A radio can take a second line, a description: the first line keeps the
  // height of a small button and the description is gap-xs below it, under the text. A note (a
  // snippet) goes in the same column under them, as a caption. The control is a <label>, so
  // pressing the text chooses it too.
  //
  // RadioGroup arranges a group; group is bindable, so a radio also works on its own.
  //
  //   <Radio name="scope" value="page" label="This page only" bind:group={scope} />
  let {
    value,
    label,
    description,
    note,
    name,
    group = $bindable(),
    disabled = false,
    id,
    onchange,
  }: {
    value: string;
    label: string;
    /** A second line that describes the choice */
    description?: string;
    /** A note under the label, in the column of the text, as a caption (a snippet) */
    note?: Snippet;
    /** The name shared by the radios of one group */
    name: string;
    /** The value chosen in the group */
    group?: string;
    disabled?: boolean;
    id?: string;
    /** Called when it is chosen, for an application that keeps the choice itself */
    onchange?: (value: string) => void;
  } = $props();
</script>

<label
  class="ctl"
  class:disabled={disabled}
  class:two={!!description || !!note}
  data-role="switch"
  data-h={description || note ? undefined : 'button-sm'}
  data-control
>
  <span class="seat">
    <input
      type="radio"
      class="radio"
      {name}
      {value}
      {id}
      {disabled}
      checked={group === value}
      onchange={() => {
        group = value;
        onchange?.(value);
      }}
    />
  </span>
  <span class="line"><span class="t">{label}</span></span>
  {#if description}<span class="desc">{description}</span>{/if}
  {#if note}<span class="desc">{@render note()}</span>{/if}
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  // The first line (the circle and the text) is as high as a small button; the description and the
  // note are in the text's column, gap-xs below
  .ctl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: gap(sm);
    row-gap: gap(xs);
    align-items: center;
    height: h(button-sm);
    min-width: 0;
    cursor: pointer;
    @include text(body);
  }
  .two {
    height: auto;
  }
  .seat,
  .line {
    display: flex;
    align-items: center;
    height: h(button-sm);
    min-width: 0;
  }
  // The control has a fixed height, so the text is one line
  .t {
    display: block;
    min-width: 0;
    @include trim;
    @include ellipsis;
  }
  .desc {
    grid-column: 2;
    @include text(caption);
  }
  .radio {
    appearance: none;
    margin: 0;
    padding: 0;
    flex: none;
    width: h(icon);
    height: h(icon);
    border: bw() solid color(line-strong);
    border-radius: 50%;
    cursor: pointer;
    background: transparent;
  }
  // The dot is the background image (an input draws no pseudo-elements)
  .radio:checked {
    border-color: color(solid);
    background: radial-gradient(circle closest-side, color(solid) 99%, transparent 100%) center /
      calc(#{h(icon)} - #{bw()} * 6) calc(#{h(icon)} - #{bw()} * 6) no-repeat;
  }
  // Disabled is the same shape without hue: the text and an empty circle are dimmed; a chosen one
  // is not dimmed, with the disabled surface for the circle and its text for the dot
  .disabled {
    cursor: default;
    .radio {
      cursor: default;
    }
    .line,
    .desc,
    .radio:not(:checked) {
      opacity: dim();
    }
    .radio:checked {
      border-color: color(solid-disabled);
      background-image: radial-gradient(
        circle closest-side,
        color(solid-disabled-text) 99%,
        transparent 100%
      );
    }
  }
</style>
