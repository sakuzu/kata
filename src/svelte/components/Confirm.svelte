<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';
  import Text from './Text.svelte';

  // Confirm: a modal that asks before an action. The title is the question, the body one paragraph
  // (what happens and to how many), and the Footer holds cancel then confirm. A destructive action
  // confirms with danger-fill, anything else with primary; this is the one place where a red fill
  // appears in a Footer. It is a small dialog in the centre on every screen.
  //
  // The first focus is on cancel, so Enter does not confirm by accident. The scrim does not close
  // it; Escape and the close button do. Confirming does not close it: the application sets open to false
  // when the work is done, and can show busy until then.
  //
  //   <Confirm bind:open title="Delete 4 items?" message="This cannot be undone."
  //     confirmLabel="Delete" danger onconfirm={run} />
  let {
    open = $bindable(false),
    title,
    message,
    children,
    confirmLabel,
    cancelLabel,
    danger = false,
    inline = false,
    busy = false,
    disabled = false,
    onconfirm,
    oncancel,
  }: {
    open?: boolean;
    /** The question */
    title: string;
    /** One paragraph of body; children replace it */
    message?: string;
    children?: Snippet;
    /** The name of the action (Delete); Confirm by default */
    confirmLabel?: string;
    /** Cancel by default */
    cancelLabel?: string;
    /** A destructive action: the confirm button is danger-fill */
    danger?: boolean;
    /** The same surface in the flow of a page, for documentation (open is ignored) */
    inline?: boolean;
    /** The action is running: the confirm button is dimmed and cannot be pressed */
    busy?: boolean;
    /** The action cannot run yet (a condition is not met); the look of the button stays */
    disabled?: boolean;
    onconfirm: () => void;
    /** Called once when it closes without confirming: cancel, Escape or the close button */
    oncancel?: () => void;
  } = $props();

  // A close that follows a confirmation is not a cancel. Reset each time it opens.
  let confirmed = false;
  $effect(() => {
    if (open) confirmed = false;
  });

  function handleClose() {
    if (confirmed) return;
    oncancel?.();
  }
</script>

<Modal bind:open size="sm" confirm {inline} {title} onclose={handleClose}>
  {#if children}
    {@render children()}
  {:else}
    <Text role="body">{message}</Text>
  {/if}
  {#snippet cancel()}
    <Button onclick={() => (open = false)}>{cancelLabel ?? getMessages().cancel}</Button>
  {/snippet}
  {#snippet primary()}
    <Button
      variant={danger ? 'danger-fill' : 'primary'}
      {busy}
      {disabled}
      onclick={() => {
        confirmed = true;
        onconfirm();
      }}
    >
      {confirmLabel ?? getMessages().confirm}
    </Button>
  {/snippet}
</Modal>
