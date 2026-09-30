<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Pin: a mark that stands on a point of the stage: the people of a comment, or a point being
  // placed. It is a capsule (a mark, like Badge and Tag) with one square corner, the top left,
  // which is the point: the pin hangs down and to the right of it, and it never moves (what it
  // opens moves away from the edge of the screen instead). It looks like a surface on the stage:
  // the panel and a strong line, no shadow. While selected (active: what it opens is open) it is
  // filled. pad-2xs inside; its content is small avatars or an icon, in a row. Faces overlap by
  // gap-xs through grid columns narrower than a small avatar.
  //
  // By default it holds the people (overlapping small avatars, and "+n" for the rest); solid is
  // a point being placed (filled, one icon). With onclick it is a button and needs a label;
  // without, it is only read.
  //
  //   <Pin label={text} onclick={open} active={isOpen} more="+2"><Avatar in initial="SA" /></Pin>
  //   <Pin solid><Icon name={MessageSquare} /></Pin>
  let {
    label,
    onclick,
    solid = false,
    active = false,
    more,
    children,
  }: {
    /** The accessible name */
    label?: string;
    /** Makes the pin a button */
    onclick?: () => void;
    /** A point being placed: filled, with one icon */
    solid?: boolean;
    /** Selected (what it opens is open): filled */
    active?: boolean;
    /** The count of the people whose faces do not fit, such as "+2" */
    more?: string;
    children: Snippet;
  } = $props();
</script>

{#if onclick}
  <button
    class="pin"
    class:solid
    class:active
    type="button"
    aria-label={label}
    aria-pressed={active}
    {onclick}
    data-role="floating"
  >
    <span class="in">{@render children()}</span>
    {#if more}<span class="more">{more}</span>{/if}
  </button>
{:else}
  <span
    class="pin"
    class:solid
    class:active
    role={label ? 'img' : undefined}
    aria-label={label}
    data-role="floating"
  >
    <span class="in">{@render children()}</span>
    {#if more}<span class="more">{more}</span>{/if}
  </span>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // A capsule whose top left corner, the point, is square
  .pin {
    display: inline-flex;
    align-items: center;
    gap: gap(2xs);
    padding: pad(2xs);
    border: bw() solid color(line-strong);
    border-radius: var(--kata-radius-pill);
    border-top-left-radius: 0;
    background: color(panel);
    color: color(text);
    font: inherit;
  }
  button.pin {
    cursor: pointer;
  }
  .active {
    background: color(solid);
    border-color: color(solid);
    color: color(on-solid);
  }
  .active .more {
    background: transparent;
    color: color(on-solid);
  }
  .solid {
    padding: 0;
    display: inline-grid;
    place-items: center;
    width: h(icon-button);
    height: h(icon-button);
    background: color(solid);
    border-color: color(solid);
    color: color(on-solid);
  }
  // The columns are gap-xs narrower than a small avatar; the padding at the right holds what the
  // last one reaches past its column
  .in {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: calc(#{h(badge)} - #{gap(xs)});
    align-items: center;
    padding-inline-end: pad(xs);
  }
  .solid .in {
    grid-auto-columns: auto;
    padding-inline-end: 0;
  }
  .in > :global(*) {
    position: relative;
  }
  // The count: a small mark as tall as a badge, its text centred and not trimmed (text, not
  // muted, which falls below 7:1 on raise-2)
  .more {
    display: inline-grid;
    place-items: center;
    min-width: h(badge);
    height: h(badge);
    padding: 0 pad(2xs);
    background: color(raise-2);
    @include text(glyph);
    color: color(text);
  }
</style>
