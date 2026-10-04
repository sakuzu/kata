<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Floating: a container that floats over the stage (a search, a navigation, a credit line), or a
  // small panel in a place that is already positioned. It has the panel color and one strong line,
  // no shadow, and floats on the floating layer. A panel placed inside needs no line of its own.
  //
  // Only its position comes from outside: the distance to each side it is pinned to. A step name
  // (2xs to xl) is that gap step; any other string is a CSS length, such as 50%. It is placed
  // absolutely in its frame, which must be a positioned element, and is no wider than the frame less
  // the left and right sides given as steps (or 0); a side given as another length is the
  // application's own and is not subtracted. With no side given it stands in the flow, fills its
  // place and stacks its content, so that text wraps inside the frame. It has no padding: list items
  // hold their own and text goes in a Block.
  //
  //   <Floating left="md" top="md"><Block>…</Block></Floating>
  type Step = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type Place = 0 | Step | (string & {});
  const STEPS = new Set(['2xs', 'xs', 'sm', 'md', 'lg', 'xl']);
  let {
    top,
    right,
    bottom,
    left,
    children,
  }: {
    top?: Place;
    right?: Place;
    bottom?: Place;
    left?: Place;
    children: Snippet;
  } = $props();

  /** A step name is a gap step; 0 is 0; anything else is used as it is */
  function at(v: Place | undefined): string | undefined {
    if (v === undefined) return undefined;
    if (v === 0) return '0';
    return STEPS.has(v) ? `var(--kata-gap-${v})` : v;
  }

  // The width left in the frame by the sides given as steps or 0, or none when a side is another
  // length (the frame's whole width then)
  const room = $derived.by(() => {
    const sides = [left, right].filter((v) => v !== undefined);
    if (!sides.every((v) => v === 0 || STEPS.has(v))) return undefined;
    const steps = sides.filter((v) => v !== 0);
    if (steps.length === 0) return undefined;
    return `calc(100% - ${steps.map((v) => `var(--kata-gap-${v})`).join(' - ')})`;
  });
</script>

<div
  class="floating"
  class:flow={top === undefined && right === undefined && bottom === undefined && left === undefined}
  data-role="floating"
  data-outline
  style:top={at(top)}
  style:right={at(right)}
  style:bottom={at(bottom)}
  style:left={at(left)}
  style:--kata-floating-room={room}
>
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .floating {
    position: absolute;
    z-index: z(floating);
    @include surface(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    min-width: 0;
    max-width: var(--kata-floating-room, 100%);
    @include bundle;
    @include scope-box(button);
  }
  .flow {
    position: static;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }
</style>
