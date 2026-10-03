<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Actions: a row of actions at the end of a container that has no Footer. The actions sit at the
  // right end, secondary then primary; lead sits at the left end (a status, or a third outcome). It
  // has no height of its own and no line, unlike Footer. Neighbours are gap-sm apart. Secondary and
  // primary are one group, as in a Footer: when it does not fit beside the lead, the whole group
  // moves below it, and when the group alone does not fit, its buttons wrap inside it, at the right
  // end and in the order written.
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
  {#if secondary || primary}
    <div class="group">
      {@render secondary?.()}
      {@render primary?.()}
    </div>
  {/if}
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
  // When the group alone does not fit, its buttons wrap inside it, kept at the right end
  .group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: gap(sm);
    flex: none;
    margin-left: auto;
    max-width: 100%;
    min-width: 0;
  }
</style>
