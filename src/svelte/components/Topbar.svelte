<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Crumbs from './Crumbs.svelte';

  // Topbar: the toolbar at the top of the screen. Its height is a Toolbar's, its surface the
  // panel's, with a strong line along the bottom; pad-md at the sides and small buttons inside.
  // Nothing inside wraps, and it keeps its height in a vertical flex.
  //
  // It has three places. The start holds lead (a button before the brand, such as the one that
  // opens a drawer), the brand (the application's name, at the size of h2, as a link with
  // brandHref), the crumbs of the current place and start (anything after them). The centre holds
  // a title or an inline edit and takes the rest of the width; what is inside clips its own text.
  // The end holds presence (who else is here) and then the actions, in groups gap-md apart. Below
  // 24rem the brand is hidden and the buttons stay.
  //
  //   <Topbar brand="Sketchbook" brandHref="/" crumbs={[{ label: 'Team', href: '/t' }, { label: 'Drafts' }]}>
  //     {#snippet end()}<Button variant="ghost" icon aria-label="Share"><Icon name={Share} /></Button>{/snippet}
  //   </Topbar>
  //
  // TODO(kata): brandMenu, the brand as the trigger of the application's Menu, once Menu is in kata.
  let {
    brand,
    brandHref,
    brandTarget,
    crumbs,
    crumbsLabel,
    lead,
    start,
    center,
    presence,
    end,
  }: {
    /** The application's name; without it there is no brand */
    brand?: string;
    /** Draws the brand as a link, with the same look */
    brandHref?: string;
    /** Opens the brand's link in another tab */
    brandTarget?: '_blank';
    /** The trail to the current place, after the brand */
    crumbs?: { label: string; href?: string; onclick?: () => void }[];
    /** The name of the trail */
    crumbsLabel?: string;
    /** Before the brand (the button that opens a drawer) */
    lead?: Snippet;
    /** After the brand and the crumbs */
    start?: Snippet;
    /** The centre: a title or an inline edit; it takes the rest of the width */
    center?: Snippet;
    /** Who else is here, before the actions */
    presence?: Snippet;
    /** The actions at the right end */
    end?: Snippet;
  } = $props();
</script>

<header class="topbar" data-role="toolbar" data-h="toolbar">
  <div class="side">
    {@render lead?.()}
    {#if brand}
      {#if brandHref}
        <a
          class="brand"
          href={brandHref}
          target={brandTarget}
          rel={brandTarget ? 'noopener' : undefined}><span class="t">{brand}</span></a
        >
      {:else}
        <span class="brand"><span class="t">{brand}</span></span>
      {/if}
    {/if}
    {#if crumbs?.length}<Crumbs items={crumbs} label={crumbsLabel} />{/if}
    {@render start?.()}
  </div>
  {#if center}<div class="center">{@render center()}</div>{/if}
  {#if presence || end}
    <div class="side end">
      {#if presence}<div class="group">{@render presence()}</div>{/if}
      {#if end}<div class="group">{@render end()}</div>{/if}
    </div>
  {/if}
</header>

<style lang="scss">
  @use '../styles/kata' as *;

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: gap(sm);
    height: h(toolbar);
    padding-inline: pad(md);
    background: color(panel);
    border-bottom: bw() solid color(line-strong);
    flex: none;
    min-width: 0;
    // Nothing wraps and the places never overlap; what does not fit is clipped
    overflow: hidden;
    @include text(body);
    @include scope-box(button-sm);
    :global(*) {
      white-space: nowrap;
    }
  }
  // The start keeps its size down to its crumbs, which shrink; the centre shrinks first
  .side {
    display: flex;
    align-items: center;
    gap: gap(sm);
    flex: 0 1 auto;
    min-width: 0;
  }
  // The groups at the end are gap-md apart; inside a group icon buttons sit side by side
  .end {
    flex: none;
    margin-left: auto;
    justify-content: flex-end;
    gap: gap(md);
  }
  .group {
    display: flex;
    align-items: center;
    gap: 0;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: gap(sm);
    flex: 1 1 0;
    min-width: 0;
  }
  // The brand: the application's name at the size of h2, text in a control
  .brand {
    display: inline-flex;
    align-items: center;
    height: h(button-sm);
    @include text(h2);
    color: color(text);
    text-decoration: none;
    flex: none;
    .t {
      display: block;
      @include trim;
    }
    &:hover {
      text-decoration: none;
    }
  }
  @include tiny {
    .brand {
      display: none;
    }
  }
</style>
