<script lang="ts">
  import '../styles/components.css';
  import { clampTip } from '../lib/clampTip.js';
  import Icon from './Icon.svelte';

  // Crumbs: a trail of places that shows where the user is. It is not an action, so a place that
  // can be pressed keeps the color of the text around it and is underlined on hover. The places are
  // separated by a faint chevron, and the last one is the current place, which cannot be pressed.
  // With current={false} the last one is a place like the others: the current place follows the
  // trail outside it (a title next to it), so a chevron follows the last place too, with gap-2xs
  // after it, and the application adds none of its own.
  //
  // The text is caption, the same in a PageHeader and in a Topbar; inside a component with a
  // height (a Toolbar, a list item) it is trimmed to its ink. Each place is at most 12rem wide and
  // ends with an ellipsis beyond it; the full text shows on hover and on keyboard focus. When the
  // width runs out the places shrink down to 4rem (a shorter place keeps its own width), and the
  // trail shrinks before what stands next to it (the title of the current place).
  //
  // It folds by its own width instead of squeezing its places, in three steps: every place, each at
  // least 4rem; only the last place (the current one), with no "…" before it; and nothing, the
  // trail keeping its name (label). The widths are measured on a hidden copy of the trail and
  // followed with a ResizeObserver (read in the delivery, written in the next frame); the trail
  // keeps the width of the whole copy, so that it can unfold when there is room again.
  //
  //   <Crumbs items={[{ label: 'Team', href: '/' }, { label: 'Drafts' }]} label="Location" />
  let {
    items,
    label,
    current = true,
  }: {
    /** The places from the first; the last is the current place */
    items: { label: string; href?: string; onclick?: () => void }[];
    /** The name of the trail */
    label?: string;
    /** Whether the last place is the current one; false when the current place follows the trail */
    current?: boolean;
  } = $props();

  /** Whether the place at i is the current one */
  const isCurrent = (i: number) => current && i === items.length - 1;

  // The least width of a place, in rem (the min-width of .t.least)
  const LEAST = 4;
  let root = $state<HTMLElement>();
  let copy = $state<HTMLElement>();
  // How far the trail is folded: 0 every place, 1 the last place only, 2 none
  let fold = $state<0 | 1 | 2>(0);
  // The width of the whole trail, in px, once measured
  let whole = $state<number>();
  // Each place, once measured: whether it is shorter than its least width (it keeps its own)
  let short = $state<boolean[]>([]);
  $effect(() => {
    const nav = root;
    const c = copy;
    if (!nav || !c || typeof ResizeObserver === 'undefined') return;
    void items.map((i) => i.label).join('\n');
    void current;
    const px = (v: string) => Number.parseFloat(v) || 0;
    let frame = 0;
    const read = () => {
      const gap = px(getComputedStyle(nav).columnGap);
      const least = LEAST * (px(getComputedStyle(document.documentElement).fontSize) || 16);
      // The copy holds the places (.cp) at their own width up to 12rem and the chevrons (.sep), each
      // with its margins (the chevron after the last place keeps gap-2xs after it)
      const parts = [...c.children].map((el) => {
        const cs = getComputedStyle(el);
        return {
          place: el.matches('.cp'),
          width:
            el.getBoundingClientRect().width + px(cs.marginInlineStart) + px(cs.marginInlineEnd),
        };
      });
      const places = parts.filter((p) => p.place);
      const last = places.at(-1);
      // Every place at its least width, the chevrons and the gaps
      const all =
        parts.reduce((sum, p) => sum + (p.place ? Math.min(p.width, least) : p.width), 0) +
        Math.max(0, parts.length - 1) * gap;
      // The last place at its least width, and the chevron after it when the trail has one
      const end = !current && parts.at(-1) && !parts.at(-1)?.place ? parts.at(-1) : undefined;
      const one = last ? Math.min(last.width, least) + (end ? gap + end.width : 0) : 0;
      // Half a pixel for the rounding of clientWidth
      const room = nav.clientWidth + 0.5;
      const next = room >= all ? 0 : room >= one ? 1 : 2;
      const size = c.getBoundingClientRect().width;
      const own = places.map((p) => p.width <= least);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        whole = size;
        short = own;
        fold = next;
      });
    };
    const ro = new ResizeObserver(read);
    ro.observe(nav);
    ro.observe(c);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  });
  /** Whether the place at i shows at this fold */
  const shows = (i: number) => fold === 0 || (fold === 1 && i === items.length - 1);
</script>

<nav
  class="crumbs"
  data-role="crumbs"
  data-edge-pass
  aria-label={label}
  bind:this={root}
  style:width={whole === undefined ? undefined : `${whole}px`}
>
  <!-- A hidden copy of the whole trail, to measure it: its chevrons are the trail's, margins and all -->
  <span class="copy" aria-hidden="true" data-kata-skip data-measure bind:this={copy}>
    {#each items as c, i (i)}
      {#if i > 0}<span class="sep"><Icon name="chevron-right" /></span>{/if}
      <span class="cp">{c.label}</span>
    {/each}
    {#if !current && items.length > 0}<span class="sep end"><Icon name="chevron-right" /></span>{/if}
  </span>
  {#each items as c, i (i)}
    {#if shows(i)}
      {#if i > 0 && fold === 0}<span class="sep" aria-hidden="true"><Icon name="chevron-right" /></span>{/if}
      {#if c.href && !isCurrent(i)}
        <a
          class="t"
          data-ink
          class:least={short[i] === false}
          class:own={short[i]}
          href={c.href}
          onclick={c.onclick}
          use:clampTip>{c.label}</a
        >
      {:else if c.onclick && !isCurrent(i)}
        <button
          class="t"
          data-ink
          class:least={short[i] === false}
          class:own={short[i]}
          type="button"
          onclick={c.onclick}
          use:clampTip>{c.label}</button
        >
      {:else}
        <span
          class="t"
          data-ink
          class:least={short[i] === false}
          class:own={short[i]}
          aria-current={isCurrent(i) ? 'page' : undefined}
          use:clampTip>{c.label}</span
        >
      {/if}
    {/if}
  {/each}
  {#if !current && items.length > 0 && fold < 2}
    <span class="sep end" aria-hidden="true"><Icon name="chevron-right" /></span>
  {/if}
</nav>

<style lang="scss">
  @use '../styles/kata' as *;

  .crumbs {
    position: relative;
    display: flex;
    align-items: center;
    // The trail shrinks first, so the current place next to it keeps its width
    flex: 0 1 auto;
    gap: gap(2xs);
    min-width: 0;
    max-width: 100%;
    // The copy reaches past the trail when it is short of width; it is cut at the sides only
    overflow-x: clip;
    overflow-y: visible;
    @include text(caption);
  }
  // A place. One that can be pressed keeps the color of the text around it and is underlined on
  // hover
  .t {
    display: block;
    max-width: 12rem;
    flex: 0 1 auto;
    border: 0;
    padding: 0;
    background: none;
    font: inherit;
    // A button keeps the tracking of the trail, as a link does (and as the copy is measured)
    letter-spacing: inherit;
    color: inherit;
    text-decoration: none;
    @include ellipsis;
  }
  // Once measured, a place shrinks down to 4rem, and one shorter than that keeps its own width
  .t.least {
    min-width: 4rem;
  }
  .t.own {
    flex: none;
  }
  a.t,
  button.t {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
    @include focus-inside;
  }
  .sep {
    display: inline-flex;
    flex: none;
    color: color(faint);
  }
  // The chevron after the last place keeps gap-2xs from what follows the trail
  .sep.end {
    margin-inline-end: gap(2xs);
  }
  // Inside a component with a height, the text is text in a control
  :global([data-h]) .t {
    @include trim;
  }
  // The copy that is measured: hidden and without a place of its own; a place at its own width up
  // to 12rem
  .copy {
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    display: flex;
    align-items: center;
    gap: gap(2xs);
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
  }
  .cp {
    display: block;
    max-width: 12rem;
    overflow-x: clip;
  }
</style>
