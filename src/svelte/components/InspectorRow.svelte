<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Pair from './Pair.svelte';

  // InspectorRow: one setting of an inspector, a Pair of a name and a value. The name column is the
  // Pair's (7.5rem, muted); the value is a control, or a value read (ReadValue). With align="start"
  // (the default) the control fills the value column; with align="end" it keeps its own width at
  // the right end (a switch, a count). small is for a control of a small button's height (a Slider,
  // a Toggle): the row takes that height, so that the name and the control stay level and the row
  // is as tall as what it shows. hint is a caption under the value.
  //
  //   <InspectorRow label="Width"><NumberInput value={2} unit="px" ariaLabel="Width" /></InspectorRow>
  //   <InspectorRow label="Visible" align="end" small><Toggle ariaLabel="Visible" /></InspectorRow>
  let {
    label,
    for: htmlFor,
    hint,
    align = 'start',
    small = false,
    children,
  }: {
    /** The name */
    label: string;
    /** The id of the control that the name labels */
    for?: string;
    /** A caption under the value */
    hint?: string;
    /** start fills the value column; end keeps the value's width at the right end */
    align?: 'start' | 'end';
    /** The value is a control of a small button's height */
    small?: boolean;
    /** The control or the value */
    children: Snippet;
  } = $props();
</script>

<div class="inspector-row" class:small>
  <Pair {label} for={htmlFor} note={hint}>
    {#if align === 'end'}
      <span class="end">{@render children()}</span>
    {:else}
      {@render children()}
    {/if}
  </Pair>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .inspector-row {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: none;
  }
  .small {
    @include scope-box(button-sm);
  }
  // The value keeps its width at the right end of the column
  .end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 0;
  }
</style>
