<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Actions: a row of actions at the end of a container that has no Footer. The actions sit at the
  // right end, secondary then primary; lead sits at the left end (a status, or a third outcome). It
  // has no height of its own and no line, unlike Footer. Neighbours are gap-sm apart.
  //
  //   <Actions>
  //     {#snippet secondary()}<Button>Cancel</Button>{/snippet}
  //     {#snippet primary()}<Button variant="primary">Save</Button>{/snippet}
  //   </Actions>
  let {
    lead,
    secondary,
    primary,
  }: {
    /** A status or an action at the left end */
    lead?: Snippet;
    secondary?: Snippet;
    primary?: Snippet;
  } = $props();
</script>

<div class="actions" data-role="actions">
  {#if lead}<div class="lead">{@render lead()}</div>{/if}
  {@render secondary?.()}
  {@render primary?.()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
  }
  .lead {
    margin-right: auto;
    display: flex;
    align-items: center;
    min-width: 0;
  }
</style>
