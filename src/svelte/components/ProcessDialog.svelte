<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Banner from './Banner.svelte';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';
  import Progress from './Progress.svelte';
  import Spinner from './Spinner.svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';

  // ProcessDialog: the frame of a dialog that runs a process on what the application passes in (a
  // conversion, an export, an operation on a selection). It is a Modal whose body reads in a fixed
  // order: the error, the description, then the fields (children), gap-lg apart. The Footer holds
  // cancel and the run action, the primary one.
  //
  // While running, the body shows what is happening instead: a Spinner with the running text and a
  // Progress (with progress, how far it is; without, a block that runs across). The run action is
  // busy. Cancel, the close button and Escape call oncancel whenever they close the dialog, also
  // while running; when the application closes it (open = false after the run) oncancel is not
  // called.
  //
  //   <ProcessDialog bind:open title="Simplify" description="Removes points that change little."
  //     runLabel="Simplify" {running} onrun={simplify} oncancel={abort}>
  //     <Field label="Tolerance" for="tol">…</Field>
  //   </ProcessDialog>
  let {
    open = $bindable(false),
    title,
    description,
    error,
    runLabel,
    runningText,
    running = false,
    progress,
    disabled = false,
    onrun,
    oncancel,
    size = 'md',
    inline = false,
    children,
  }: {
    open?: boolean;
    title: string;
    /** What the process does, in a sentence or two, above the fields */
    description?: string;
    /** Why the last run failed, in a red notice at the top */
    error?: string;
    /** The run action; the run message by default */
    runLabel?: string;
    /** What shows while running; the running message by default */
    runningText?: string;
    /** The process runs: the body shows the progress and the run action is busy */
    running?: boolean;
    /** How far the process is, 0 to 100; without it the progress is indeterminate */
    progress?: number;
    /** The run action cannot be pressed (a field is missing) */
    disabled?: boolean;
    /** Called when the run action is pressed */
    onrun?: () => void;
    /** Called when the user closes the dialog without running it, or stops a run */
    oncancel?: () => void;
    /** The width, as Modal's size */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** The same surface in the flow of a page, for documentation */
    inline?: boolean;
    /** The fields of the process */
    children?: Snippet;
  } = $props();

  const words = $derived(getMessages());

  function cancel() {
    open = false;
    oncancel?.();
  }
  // Every way of closing ends here; it is a cancel unless the application closed the dialog
  function onclose() {
    if (open) cancel();
  }
</script>

{#snippet cancelAction()}<Button onclick={cancel}>{words.cancel}</Button>{/snippet}
{#snippet runAction()}
  <Button variant="primary" busy={running} {disabled} onclick={() => onrun?.()}>
    {runLabel ?? words.run}
  </Button>
{/snippet}

<Modal {open} {title} {size} {inline} {onclose} cancel={cancelAction} primary={runAction}>
  {#if running}
    <Stack gap="sm">
      <div class="live" aria-live="polite"><Spinner label={runningText ?? words.running} /></div>
      <Progress value={progress} label={runningText ?? words.running} />
    </Stack>
  {:else}
    {#if error}<Banner tone="error">{error}</Banner>{/if}
    {#if description}<Text>{description}</Text>{/if}
    {#if children}<Stack gap="lg">{@render children()}</Stack>{/if}
  {/if}
</Modal>

<style lang="scss">
  // The Spinner is a mark of its own, so the region that announces it lays it out as a block
  .live {
    display: flex;
  }
</style>
