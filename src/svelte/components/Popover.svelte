<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Bubble from './Bubble.svelte';
  import Dropdown from './Dropdown.svelte';

  // Popover: a small surface that opens next to its trigger, for a few settings, a small picker or
  // an explanation. Its surface is a Bubble (pad-md inside, the children gap-sm apart by default).
  // It shows in the top layer, so a modal or a panel around the trigger does not hide it. It opens
  // below the trigger, or above when there is no room (with up, the other way round), and a press
  // outside, Escape or Tab closes it; the placement is Dropdown's. A list of actions is a menu
  // (Dropdown with menu), not a Popover.
  //
  //   <Popover align="start">
  //     {#snippet anchor(toggle, open)}
  //       <Button aria-expanded={open} onclick={toggle}>Snapping</Button>
  //     {/snippet}
  //     <Toggle between label="Vertices" … />
  //   </Popover>
  let {
    anchor,
    align = 'start',
    up = false,
    gap = 'sm',
    openInitially = false,
    children,
  }: {
    /** The trigger; it receives the toggle function and whether the popover is open */
    anchor: Snippet<[() => void, boolean]>;
    /** The edge of the trigger the popover lines up with */
    align?: 'start' | 'end';
    /** Opens above the trigger, and below only when there is no room above */
    up?: boolean;
    /** The distance between the children */
    gap?: 0 | 'sm' | 'md' | 'lg';
    /** Open from the start */
    openInitially?: boolean;
    /** The content; it receives the close function */
    children: Snippet<[() => void]>;
  } = $props();
</script>

<Dropdown bare {align} {up} {openInitially}>
  {#snippet trigger(toggle, open)}{@render anchor(toggle, open)}{/snippet}
  {#snippet panel(close)}
    <Bubble {gap}>{@render children(close)}</Bubble>
  {/snippet}
</Dropdown>
