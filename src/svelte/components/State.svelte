<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Actions from './Actions.svelte';
  import Spinner from './Spinner.svelte';
  import Stack from './Stack.svelte';

  // State: what a place shows when it is empty, loading or has failed: one sentence and at most
  // one note, at the start, and one action at the end (as in Actions); no picture and no heading.
  // No padding: the padding of the container it sits in applies. The sentence and the note are
  // trimmed only at the edge of the container; sentence, note and action are gap-sm apart. A
  // failure is a red sentence.
  //
  //   <State text="Nothing is here yet." note="Drop a file, or…">
  //     {#snippet actions()}<Button>Add a file</Button>{/snippet}
  //   </State>
  //   <State loading text="Loading" />   <State tone="error" text="It could not be loaded." />
  let {
    text,
    note,
    tone,
    loading = false,
    actions,
  }: {
    /** The sentence */
    text: string;
    /** One sentence under it, as a caption */
    note?: string;
    /** error: a failure */
    tone?: 'error';
    /** Loading: a Spinner with the sentence as its label */
    loading?: boolean;
    /** One action */
    actions?: Snippet;
  } = $props();
</script>

<div class="state" data-role="state">
  <Stack gap="sm">
    {#if loading}
      <Spinner label={text} />
    {:else}
      <p class="t" class:error={tone === 'error'} data-role="p" data-ink>{text}</p>
    {/if}
    {#if note}<span class="note" data-role="caption" data-ink>{note}</span>{/if}
    {#if actions}<Actions primary={actions} />{/if}
  </Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .state {
    color: color(muted);
    min-width: 0;
    @include scope-box(button);
  }
  .t {
    display: block;
    margin: 0;
    color: color(text);
    min-width: 0;
    @include text(body);
  }
  .t.error {
    color: color(red-ink);
  }
  .note {
    display: block;
    @include text(caption);
    color: color(muted);
  }
</style>
