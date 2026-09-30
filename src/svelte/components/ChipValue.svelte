<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // ChipValue: a small surface attached to a point of the stage, which follows it. It holds a
  // value: an input of a number and the button that confirms it, or the value alone to read. The
  // surface is the panel with a strong line; pad-sm inside and gap-sm between its children. It
  // declares the small button for the controls inside, so the author writes no size.
  //
  // It is placed absolutely inside the frame that holds the stage (a positioned parent), at the
  // point's distance from the frame's edges: a gap step or a length.
  //
  // Collapsed, the chip only reads the value and is itself the trigger that expands it: pass
  // onclick and label, and the root is a button. rows stacks list items, for several values.
  //
  //   <ChipValue left="12rem" top="8rem"><NumberInput … /><Button>Apply</Button></ChipValue>
  //   <ChipValue left="12rem" top="8rem" label="Edit the value" onclick={expand}>12.5 m</ChipValue>
  type Step = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  type Place = 0 | Step | (string & {});
  const STEPS: readonly string[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  let {
    top,
    right,
    bottom,
    left,
    rows = false,
    onclick,
    label,
    children,
  }: {
    /** The distances from the edges of the frame: 0, a gap step or a length */
    top?: Place;
    right?: Place;
    bottom?: Place;
    left?: Place;
    /** Stacks list items (a collapsed chip with several values) */
    rows?: boolean;
    /** The chip is the trigger that expands it; the root becomes a button */
    onclick?: (e: MouseEvent) => void;
    /** The accessible name of the trigger */
    label?: string;
    children: Snippet;
  } = $props();

  function at(v: Place | undefined): string | undefined {
    if (v === undefined) return undefined;
    if (v === 0) return '0';
    return STEPS.includes(v) ? `var(--kata-gap-${v})` : v;
  }
</script>

{#if onclick}
  <button
    type="button"
    class="chip-value"
    class:rows
    data-role="floating"
    aria-label={label}
    {onclick}
    style:top={at(top)}
    style:right={at(right)}
    style:bottom={at(bottom)}
    style:left={at(left)}
  >
    {@render children()}
  </button>
{:else}
  <div
    class="chip-value"
    class:rows
    data-role="floating"
    style:top={at(top)}
    style:right={at(right)}
    style:bottom={at(bottom)}
    style:left={at(left)}
  >
    {@render children()}
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .chip-value {
    position: absolute;
    z-index: z(floating);
    display: flex;
    align-items: center;
    gap: gap(sm);
    padding: pad(sm);
    background: color(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    white-space: nowrap;
    @include text(body);
    @include scope-box(button-sm);
    > :global(*) {
      flex: none;
    }
  }
  // The chip as a trigger: its text is the text around it
  button.chip-value {
    font: inherit;
    @include text(body);
    text-align: start;
    cursor: pointer;
    &:hover {
      background: color(raise);
    }
  }
  .rows {
    flex-direction: column;
    align-items: stretch;
  }
</style>
