<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick, untrack } from 'svelte';

  // Footer: the actions at the bottom of a modal or a panel, in a fixed order: lead on the left,
  // then secondary, cancel and primary on the right. A destructive action does not go here (it is
  // the primary action of a confirmation). The height is a button plus pad-md above and below; the
  // sides are pad-md and a line runs along the top. The parts stay in one row as long as the row
  // fits; it stacks only when the row does not fit, every part at full width, primary first and the
  // lead last. The footer measures its row (a ResizeObserver, read in the delivery and written in
  // the next frame), and measures again when its content changes.
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

  let root = $state<HTMLElement>();
  // Whether the row does not fit and the parts stack
  let stacked = $state(false);
  $effect(() => {
    const el = root;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const px = (v: string) => Number.parseFloat(v) || 0;
    // The width the row needs, measured while it is a row and kept while it is stacked
    let need = 0;
    let frame = 0;
    const write = (next: boolean) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (stacked !== next) stacked = next;
      });
    };
    const read = () => {
      const cs = getComputedStyle(el);
      const room = el.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight);
      if (!untrack(() => stacked)) {
        const parts = [...el.querySelectorAll(':scope > .lead > *, :scope > .actions > *')];
        need =
          parts.reduce((sum, part) => sum + part.getBoundingClientRect().width, 0) +
          Math.max(0, parts.length - 1) * px(cs.columnGap);
      }
      // Half a pixel for the rounding of clientWidth
      write(need - room > 0.5);
    };
    const ro = new ResizeObserver(read);
    ro.observe(el);
    // When the content changes, the row is laid out again and measured
    const mo = new MutationObserver(() => {
      if (!untrack(() => stacked)) {
        read();
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        stacked = false;
        tick().then(read);
      });
    });
    mo.observe(el, { subtree: true, childList: true, characterData: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  });
</script>

<div
  class="footer"
  class:stacked
  data-role="footer"
  data-h="footer"
  data-stacked={stacked ? '' : undefined}
  bind:this={root}
>
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
    flex-wrap: nowrap;
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
  // In the row, the parts keep their size, so that what the row needs can be measured
  .lead > :global(*),
  .actions > :global(*) {
    flex: none;
  }
  // Stacked: full-width parts, primary first, the lead last
  .footer.stacked {
    flex-direction: column;
    align-items: stretch;
  }
  .stacked > .actions {
    flex-direction: column-reverse;
    align-items: stretch;
    margin-left: 0;
  }
  .stacked > .lead {
    order: 1;
    margin-right: 0;
    flex-direction: column;
    align-items: stretch;
  }
</style>
