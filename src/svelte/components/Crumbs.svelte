<script lang="ts">
  import '../styles/components.css';
  import { clampTip } from '../lib/clampTip.js';
  import Icon from './Icon.svelte';

  // Crumbs: a trail of places that shows where the user is. It is not an action, so a place that
  // can be pressed keeps the color of the text around it and is underlined on hover. The places are
  // separated by a faint chevron, and the last one is the current place, which cannot be pressed.
  //
  // The text is caption, the same in a PageHeader and in a Topbar; inside a component with a
  // height (a Toolbar, a list item) it is trimmed to its ink. Each place is at most 12rem wide and
  // ends with an ellipsis beyond it; the full text shows on hover and on keyboard focus. When the
  // width runs out the places shrink down to 4rem, and the trail shrinks before what stands next to
  // it (the title of the current place).
  //
  //   <Crumbs items={[{ label: 'Team', href: '/' }, { label: 'Drafts' }]} label="Location" />
  let {
    items,
    label,
  }: {
    /** The places from the first; the last is the current place */
    items: { label: string; href?: string; onclick?: () => void }[];
    /** The name of the trail */
    label?: string;
  } = $props();
</script>

<nav class="crumbs" data-role="crumbs" aria-label={label}>
  {#each items as c, i (i)}
    {#if i > 0}<span class="sep" aria-hidden="true"><Icon name="chevron-right" /></span>{/if}
    {#if c.href && i < items.length - 1}
      <a class="t" href={c.href} onclick={c.onclick} use:clampTip>{c.label}</a>
    {:else if c.onclick && i < items.length - 1}
      <button class="t" type="button" onclick={c.onclick} use:clampTip>{c.label}</button>
    {:else}
      <span class="t" aria-current={i === items.length - 1 ? 'page' : undefined} use:clampTip
        >{c.label}</span
      >
    {/if}
  {/each}
</nav>

<style lang="scss">
  @use '../styles/kata' as *;

  .crumbs {
    display: flex;
    align-items: center;
    // The trail shrinks first, so the current place next to it keeps its width
    flex: 0 1 auto;
    gap: gap(2xs);
    min-width: 0;
    @include text(caption);
  }
  // A place. One that can be pressed keeps the color of the text around it and is underlined on
  // hover
  .t {
    display: block;
    max-width: 12rem;
    min-width: min(100%, 4rem);
    flex: 0 1 auto;
    border: 0;
    padding: 0;
    background: none;
    font: inherit;
    color: inherit;
    text-decoration: none;
    @include ellipsis;
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
  // Inside a component with a height, the text is text in a control
  :global([data-h]) .t {
    @include trim;
  }
</style>
