<script lang="ts">
  import '../styles/components.css';
  import { tick, untrack } from 'svelte';
  import Icon from './Icon.svelte';

  // InlineEdit: text that is changed where it stands. Read, it is a control without a line (the
  // height its container declares, no padding at the sides, so its edge lines up with the text
  // around it), with a surface and a pencil on hover. Edited, it becomes a control with a blue line
  // and pad-sm at the sides. Enter commits and Escape restores. When the text is emptied, the
  // application decides the name that takes its place.
  //
  // Resting (read, or the add action), it has no line and no surface, so it is text without an
  // edge: the edge flags pass through it (data-pass), and at the edge of a container the room its
  // box keeps above or below the ink is trimmed, so that the distance is measured from the text, as
  // from Text at an edge. Edited, it keeps its box.
  //
  // Three states:
  //   empty and editable    a text action, "+ placeholder"
  //   a value and editable  the text and a pencil; pressing it edits
  //   not editable          the text alone (nothing when empty)
  // Without a pencil or an action, the text cannot be changed.
  //
  //   <InlineEdit bind:value={name} placeholder="Add a description" onCommit={save} />
  let {
    value = $bindable(''),
    placeholder,
    editable = true,
    title = false,
    multiline = false,
    editing = $bindable(false),
    onCommit,
    label,
  }: {
    value?: string;
    /** The action shown when empty (for example Add a description); the component adds the + */
    placeholder: string;
    /** false shows the text only */
    editable?: boolean;
    /** A title, at the size and weight of h2 */
    title?: boolean;
    /** Several lines: Enter adds a line; blur or ⌘/Ctrl+Enter commits */
    multiline?: boolean;
    /** Called when the value has changed, with the text trimmed at both ends */
    onCommit: (v: string) => void;
    /** The accessible name of the input and of the text (the placeholder by default) */
    label?: string;
    /** Whether it is being edited, for an application that holds back updates meanwhile */
    editing?: boolean;
  } = $props();

  let draft = $state('');
  let inputEl = $state<HTMLInputElement | HTMLTextAreaElement | undefined>();
  // blur also fires after Escape; this says whether the edit may still be committed. It is a plain
  // variable, so that it does not depend on the order in which the input is removed.
  let armed = false;

  const a11yLabel = $derived(label ?? placeholder);

  function start() {
    if (!editable || editing) return;
    begin();
  }

  function begin() {
    draft = value;
    editing = true;
    armed = true;
    tick().then(() => {
      inputEl?.focus();
      inputEl?.select();
    });
  }

  // editing set to true by the application (a key such as F2) starts an edit as a press does
  $effect(() => {
    if (editing && !armed && editable) untrack(begin);
  });

  function commit() {
    if (!armed) return;
    armed = false;
    editing = false;
    const next = draft.trim();
    if (next === value) return;
    value = next;
    onCommit(next);
  }

  function cancel() {
    armed = false;
    editing = false;
  }

  function onkeydown(e: KeyboardEvent) {
    // The Enter that ends a composition (an input method) does not commit
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      // Escape ends the edit here and does not reach a panel or a modal around it
      e.stopPropagation();
      cancel();
      return;
    }
    if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commit();
    }
  }
</script>

{#if editing}
  <span
    class="ie editing"
    class:title
    class:multi={multiline}
    data-role="box"
    data-h={multiline ? undefined : 'button'}
  >
    {#if multiline}
      <textarea
        rows={1}
        bind:this={inputEl}
        bind:value={draft}
        aria-label={a11yLabel}
        onblur={commit}
        {onkeydown}
      ></textarea>
    {:else}
      <input
        type="text"
        bind:this={inputEl}
        bind:value={draft}
        aria-label={a11yLabel}
        onblur={commit}
        {onkeydown}
      />
    {/if}
  </span>
{:else if !editable}
  {#if value !== ''}
    <span class="ie read rest" class:title class:multi={multiline} data-role="box" data-pass>
      <span class="lines"><span class="t clamp">{value}</span></span>
    </span>
  {/if}
{:else if value !== ''}
  <button
    class="ie rest"
    class:title
    class:multi={multiline}
    type="button"
    aria-label={a11yLabel}
    onclick={start}
    data-role="box"
    data-pass
  >
    <span class="lines">
      <span class="t clamp">{value}</span>
      <span class="pen"><Icon name="pencil" /></span>
    </span>
  </button>
{:else}
  <button class="add rest" type="button" aria-label={a11yLabel} onclick={start} data-role="box" data-pass>
    <span class="lines"><span class="mark"><Icon name="plus" /></span><span class="t">{placeholder}</span></span>
  </button>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // Read: the height its container declares, no padding at the sides, a transparent line. The
  // area that is pressed and the hover surface are this box.
  .ie {
    display: inline-flex;
    align-items: center;
    gap: gap(sm);
    height: box-h();
    max-width: 100%;
    padding: 0;
    border: bw() solid transparent;
    background: none;
    color: inherit;
    @include text(body);
    text-align: start;
    cursor: text;
    min-width: 0;
  }
  .title {
    @include text(h2);
  }
  // Resting (read, or the add action), the room the box keeps above and below the ink is trimmed
  // at the edge of a container (the edge flags pass through it; they are 0 or 1): the box is
  // shorter by that room on each side that touches an edge, and has no line there
  .rest {
    --kata-inline-edit-room: calc((#{box-h()} - 1em * var(--kata-ink)) / 2);
    --kata-inline-edit-cut: calc(
      var(--kata-inline-edit-room) * (var(--kata-at-start, 0) + var(--kata-at-end, 0))
    );
    height: calc(#{box-h()} - var(--kata-inline-edit-cut));
    border-top-width: calc(#{bw()} * (1 - var(--kata-at-start, 0)));
    border-bottom-width: calc(#{bw()} * (1 - var(--kata-at-end, 0)));
  }
  // The content of a resting form: the text, and the icons as high as its ink and centred on it.
  // As the text of LinkAction, the text keeps its line box in a layout, centred in the box; inside
  // a component that declares its height (a list item, a toolbar) it is text in a control, trimmed
  // to its ink. At an edge the line is trimmed on that side and sits on that side of the shorter box
  .lines {
    display: flex;
    align-items: center;
    gap: gap(sm);
    min-width: 0;
  }
  // The text gives the form its baseline (not the icon before it), so that a name beside it can
  // stand on the same baseline (a Pair that is top)
  .lines > .t {
    align-self: baseline;
  }
  @container style(--kata-in-control: 1) {
    .t {
      @include trim;
    }
  }
  @container style(--kata-at-start: 1) {
    .lines {
      align-self: flex-start;
      align-items: flex-start;
    }
    .t {
      @include trim-start;
    }
  }
  @container style(--kata-at-end: 1) {
    .lines {
      align-self: flex-end;
      align-items: flex-end;
    }
    .t {
      @include trim-end;
    }
  }
  @container style(--kata-at-start: 1) and style(--kata-at-end: 1) {
    .t {
      text-box-trim: trim-both;
    }
  }
  .t {
    display: block;
    min-width: 0;
  }
  .clamp {
    @include ellipsis;
  }
  button.ie {
    cursor: pointer;
    &:hover {
      background: color(raise);
    }
    &:hover .pen {
      color: color(muted);
    }
  }
  // The sign that the text can be changed: always faintly there, muted on hover
  .pen,
  .mark {
    display: flex;
    flex: none;
    align-items: center;
    height: calc(1em * var(--kata-ink));
  }
  .pen {
    color: color(faint);
  }
  .read {
    cursor: default;
  }
  // Edited: a blue line, pad-sm at the sides
  .editing {
    border-color: color(blue-ink);
    padding-inline: pad(sm);
  }
  .ie input,
  .ie textarea {
    @include bare-control;
    flex: 1;
    width: 100%;
    align-self: stretch;
  }
  // Several lines wrap and show the whole text. The box grows with it, and the padding above and
  // below puts the first line where a one-line control puts its text.
  .multi {
    --kata-inline-edit-pad: calc((#{box-h()} - #{bw()} * 2 - #{fs(body)} * #{lh(body)}) / 2);
    height: auto;
    min-height: box-h();
    align-items: flex-start;
    white-space: normal;
  }
  // Read, several lines are text that wraps, not trimmed
  .multi .clamp {
    @include untrim;
    white-space: pre-wrap;
    overflow: visible;
    text-overflow: clip;
    padding-block: var(--kata-inline-edit-pad);
  }
  .multi:not(.editing) {
    display: block;
    min-height: calc(#{box-h()} - var(--kata-inline-edit-cut));
    .lines {
      display: block;
      height: auto;
    }
    .clamp {
      display: inline;
    }
    .pen {
      display: inline-flex;
      height: auto;
      vertical-align: middle;
      margin-left: pad(sm);
    }
  }
  // At an edge, the line of several that touches it is trimmed, as Text at an edge
  @container style(--kata-at-start: 1) {
    .multi .lines {
      @include trim-start;
    }
  }
  @container style(--kata-at-end: 1) {
    .multi .lines {
      @include trim-end;
    }
  }
  @container style(--kata-at-start: 1) and style(--kata-at-end: 1) {
    .multi .lines {
      text-box-trim: trim-both;
    }
  }
  .ie textarea {
    resize: none;
    field-sizing: content;
    line-height: lh(body);
    padding-block: var(--kata-inline-edit-pad);
  }
  // The action when empty: text only, like LinkAction
  .add {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: 0;
    background: none;
    color: color(blue-ink);
    @include text(body);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
