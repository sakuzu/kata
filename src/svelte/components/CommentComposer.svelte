<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import InputGroup from './InputGroup.svelte';
  import Textarea from './Textarea.svelte';

  // CommentComposer: where a comment or a reply is written: a Textarea that grows up to four lines
  // and the button that posts it, in an InputGroup. Enter posts and Shift+Enter starts a new line
  // (never while a character is being composed); Escape calls oncancel. The text is trimmed; empty
  // text is not posted. The text is cleared after a post, unless onpost returns false (or a promise
  // of false), for example when sending failed; while its promise runs, the composer waits.
  //
  //   <CommentComposer onpost={(text) => reply(id, text)} placeholder="Reply" />
  let {
    onpost,
    placeholder,
    submitLabel,
    value = $bindable(''),
    oncancel,
    disabled = false,
    autofocus = false,
  }: {
    /** Called with the trimmed text; false (or a promise of false) keeps the text */
    onpost: (text: string) => boolean | undefined | Promise<boolean | undefined>;
    /** The placeholder and the accessible name ("Write a comment" by default) */
    placeholder?: string;
    /** The text of the button ("Post" by default) */
    submitLabel?: string;
    /** The text being written */
    value?: string;
    /** Called with Escape */
    oncancel?: () => void;
    disabled?: boolean;
    /** Takes the focus when it shows, with the caret at the end */
    autofocus?: boolean;
  } = $props();

  let busy = $state(false);
  let el = $state<HTMLTextAreaElement>();
  const hint = $derived(placeholder ?? getMessages().writeComment);

  async function post() {
    const text = value.trim();
    if (busy || disabled || !text) return;
    busy = true;
    try {
      const kept = (await onpost(text)) === false;
      if (!kept) value = '';
    } finally {
      busy = false;
    }
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void post();
    } else if (e.key === 'Escape' && oncancel) {
      e.stopPropagation();
      oncancel();
    }
  }

  $effect(() => {
    if (!autofocus || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  });
</script>

<InputGroup>
  <Textarea
    bind:value
    bind:el
    rows={1}
    maxRows={4}
    placeholder={hint}
    ariaLabel={hint}
    disabled={disabled || busy}
    {onkeydown}
  />
  {#snippet action()}
    <Button variant="primary" disabled={disabled || busy || !value.trim()} onclick={post}
      >{submitLabel ?? getMessages().post}</Button
    >
  {/snippet}
</InputGroup>
