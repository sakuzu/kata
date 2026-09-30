<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Field: an input with its name above and a note below: the name, gap-xs, the control, gap-xs,
  // the note. The name and the note are text that is not trimmed. The name is as large as the text
  // in the control (body), and the note is a caption. The distance between fields (gap-lg) is the
  // Stack's. An error is one red sentence in the place of the note, and the name turns red too.
  //
  //   <Field label="Name" for="name" note="…" error={message}><TextInput id="name" … /></Field>
  let {
    label,
    note,
    error,
    for: htmlFor,
    width,
    children,
  }: {
    label: string;
    /** One sentence under the control */
    note?: string;
    /** The error, in the place of the note */
    error?: string;
    /** The id of the control */
    for?: string;
    /** A fixed width, for short inputs only (28rem is the limit of a long one) */
    width?: '6rem' | '8rem' | '12rem' | '20rem' | '28rem';
    children: Snippet;
  } = $props();
  const noteId = $derived(htmlFor ? `${htmlFor}-note` : undefined);
</script>

<div class="field" class:err={!!error} data-role="field" data-pass style:max-width={width}>
  <label class="label" for={htmlFor}>{label}</label>
  <div class="box">{@render children()}</div>
  {#if error}
    <span class="note error" data-role="caption" id={noteId}>{error}</span>
  {:else if note}
    <span class="note" data-role="caption" id={noteId}>{note}</span>
  {/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .field {
    display: flex;
    flex-direction: column;
    gap: gap(xs);
    min-width: 0;
    @include scope-box(button);
  }
  .label {
    @include text(body);
    color: color(muted);
  }
  .box {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .note {
    @include text(caption);
    color: color(muted);
  }
  .err .label,
  .err .note {
    color: color(red-ink);
  }
</style>
