<script lang="ts">
  import '../styles/components.css';
  import { tick, untrack } from 'svelte';
  import Icon from './Icon.svelte';

  // InlineEdit: text that is changed where it stands. Read, it is a control without a line or a
  // surface: it is laid out as its text and the pencil, as text is (trimmed at an edge, and inside
  // a control), with no padding, so its edge lines up with the text around it; its hit area and
  // the surface it shows on hover reach the control's height around it without taking room (the
  // reach mixin). Edited, it becomes a control with a blue line and pad-sm at the sides, the
  // height its container declares, so entering the edit makes it taller. Enter commits and Escape
  // restores. When the text is emptied, the application decides the name that takes its place.
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
    <span
      class="ie read"
      class:title
      class:multi={multiline}
      data-role="box"
      data-edge-pass><span class="t clamp" data-ink>{value}</span></span
    >
  {/if}
{:else if value !== ''}
  <button
    class="ie"
    class:title
    class:multi={multiline}
    type="button"
    aria-label={a11yLabel}
    onclick={start}
    data-role="box"
    data-edge-pass
  >
    <span class="t clamp" data-ink>{value}</span>
    <span class="pen"><Icon name="pencil" /></span>
  </button>
{:else}
  <button class="add" type="button" aria-label={a11yLabel} onclick={start} data-role="box" data-edge-pass>
    <span class="line" data-edge-pass
      ><span class="mark"><Icon name="plus" /></span><span class="t" data-ink>{placeholder}</span></span
    >
  </button>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .ie {
    align-items: center;
    gap: gap(sm);
    max-width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    @include text(body);
    text-align: start;
    cursor: text;
  }
  // Read: a control without a line or a surface, laid out as its text and the pencil. It is a
  // block of its own, never a glyph on a line of text, and as wide as what it shows; the area that
  // is pressed and the hover surface are its reach
  .ie:not(.editing) {
    display: flex;
    width: fit-content;
    @include reach;
  }
  .title {
    @include text(h2);
  }
  // Text: its line box in a layout, trimmed at an edge (data-ink), and trimmed to its ink inside a
  // control
  .t {
    display: block;
    min-width: 0;
  }
  :global([data-h]) .t {
    @include trim;
  }
  .clamp {
    @include ellipsis;
  }
  button.ie {
    cursor: pointer;
    &:hover::before {
      background: color(raise);
    }
    &:hover .pen {
      color: color(muted);
    }
  }
  // The sign that the text can be changed: always faintly there, muted on hover
  .pen {
    display: flex;
    flex: none;
    color: color(faint);
  }
  .read {
    cursor: default;
  }
  // Edited: a control with a blue line, pad-sm at the sides, the height its container declares
  .editing {
    display: inline-flex;
    height: box-h();
    border: bw() solid color(blue-ink);
    padding-inline: pad(sm);
  }
  .ie input,
  .ie textarea {
    @include bare-control;
    flex: 1;
    width: 100%;
    align-self: stretch;
  }
  // Several lines wrap and show the whole text. Read, the pencil is a mark beside text that may
  // wrap: it hangs from a seat of no height, centred on the ink of the first line, as the end of a
  // Text does
  .multi {
    white-space: normal;
  }
  .multi:not(.editing) {
    align-items: first baseline;
    .clamp {
      white-space: pre-wrap;
      overflow: visible;
      text-overflow: clip;
    }
    .pen {
      @include seat(0);
    }
  }
  // Edited, the box grows with the text, and the padding above and below puts the first line where
  // a one-line control puts its text
  .multi.editing {
    --kata-inline-edit-pad: calc((#{box-h()} - #{bw()} * 2 - #{fs(body)} * #{lh(body)}) / 2);
    height: auto;
    min-height: box-h();
    align-items: flex-start;
  }
  .ie textarea {
    resize: none;
    field-sizing: content;
    line-height: lh(body);
    padding-block: var(--kata-inline-edit-pad);
  }
  // The action when empty: text only, like LinkAction
  .add {
    display: flex;
    width: fit-content;
    max-width: 100%;
    align-items: center;
    padding: 0;
    border: 0;
    background: none;
    color: color(blue-ink);
    @include text(body);
    cursor: pointer;
    @include reach;
    &:hover {
      text-decoration: underline;
    }
  }
  // The + is a mark beside a line of text: it sits in a seat, and the line aligns by its first
  // baseline, so the action's first baseline is the text's and the + is centred on its ink. The
  // line is centred in the action, which may be laid out at its reach
  .line {
    display: flex;
    align-items: baseline;
    gap: gap(sm);
    min-width: 0;
  }
  .mark {
    @include seat(h(icon));
  }
</style>
