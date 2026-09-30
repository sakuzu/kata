<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Footer: the actions at the bottom of a modal or a panel, in a fixed order: lead on the left,
  // then secondary, cancel and primary on the right. A destructive action does not go here (it is
  // the primary action of a confirmation). The height is a button plus pad-md above and below; the
  // sides are pad-md and a line runs along the top. When the actions do not fit beside the lead, the
  // whole group moves below it; below 48rem everything stacks at full width, primary first.
  //
  //   <Footer>
  //     {#snippet cancel()}…{/snippet}
  //     {#snippet primary()}…{/snippet}
  //   </Footer>
  let {
    lead,
    secondary,
    cancel,
    primary,
  }: {
    /** A status or an action on the left */
    lead?: Snippet;
    secondary?: Snippet;
    cancel?: Snippet;
    primary?: Snippet;
  } = $props();
</script>

<div class="footer" data-role="footer" data-h="footer">
  {#if lead}<div class="lead">{@render lead()}</div>{/if}
  <div class="actions">
    {@render secondary?.()}
    {@render cancel?.()}
    {@render primary?.()}
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: gap(sm);
    min-height: h(footer);
    padding: pad(md);
    border-top: bw() solid color(line);
    flex: none;
    @include text(body);
    @include scope-box(button);
  }
  .lead {
    margin-right: auto;
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1 1 auto;
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: gap(sm);
    margin-left: auto;
    flex: none;
    max-width: 100%;
  }
  // Narrow: full-width buttons, primary first, the lead last
  @include narrow {
    .footer {
      flex-direction: column;
      align-items: stretch;
    }
    .actions {
      flex-direction: column-reverse;
      align-items: stretch;
      margin-left: 0;
    }
    .lead {
      order: 1;
      margin-right: 0;
    }
  }
</style>
