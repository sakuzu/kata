<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick, untrack } from 'svelte';
  import type { MenuModel } from '../lib/menuModel.js';
  import Crumbs from './Crumbs.svelte';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import MenuList from './MenuList.svelte';

  // Topbar: the toolbar at the top of the screen. Its height is a Toolbar's, its surface the
  // panel's, with a strong line along the bottom; pad-md at the sides and small buttons inside.
  // Nothing inside wraps, and it keeps its height in a vertical flex.
  //
  // It has three places. The start holds lead (a button before the brand, such as the one that
  // opens a drawer), the brand (the application's name, at the size of h2, as a link with
  // brandHref, or the trigger of the application's menu with brandMenu), the crumbs of the current place and start (anything after them). The centre holds
  // a title or an inline edit and takes the rest of the width; what is inside clips its own text.
  // The end holds presence (who else is here, a Presence) and then the actions, in groups gap-md
  // apart.
  //
  // The brand never hides. The bar measures its row (a ResizeObserver, read in the delivery and
  // written in the next frame, and again when its content changes) and, when the row does not fit,
  // passes { compact: true } to presence first (the application shows a count: Presence max={0}),
  // then to end too (the application folds its actions into a Kebab). It stops at the first step
  // that fits, and goes back when the width allows the row again. When even that does not fit, the
  // brand ends with an ellipsis.
  //
  // menu gives the brand's menu as a model (MenuModel[], the same as AppMenu's) instead of the
  // brandMenu snippet; onmenu receives the id of the item that was chosen.
  //
  //   <Topbar brand="Sketchbook" brandHref="/" crumbs={[{ label: 'Team', href: '/t' }, { label: 'Drafts' }]}>
  //     {#snippet end()}<Button variant="ghost" icon aria-label="Share"><Icon name={Share} /></Button>{/snippet}
  //   </Topbar>
  let {
    brand,
    brandHref,
    brandTarget,
    brandMenu,
    menu,
    onmenu,
    brandLabel,
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
    /** Makes the brand the trigger of the application's menu: the MenuItems; close closes it */
    brandMenu?: Snippet<[() => void]>;
    /** Makes the brand the trigger of a menu drawn from a model */
    menu?: MenuModel[];
    /** Called with the id of the item of the model that was chosen */
    onmenu?: (id: string) => void;
    /** The name of the menu's trigger */
    brandLabel?: string;
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
    /** Who else is here, before the actions; compact asks for a count when the row is short */
    presence?: Snippet<[{ compact: boolean }]>;
    /** The actions at the right end; compact asks to fold them into a Kebab when the row is short */
    end?: Snippet<[{ compact: boolean }]>;
  } = $props();

  let root = $state<HTMLElement>();
  // How far the row is compacted: 0 not at all, 1 the presence, 2 the presence and the actions
  let level = $state<0 | 1 | 2>(0);
  $effect(() => {
    const el = root;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const px = (v: string) => Number.parseFloat(v) || 0;
    // The width the row needs at each level, measured while it is at that level and kept
    const needs: (number | undefined)[] = [];
    let frame = 0;
    // The width a part takes with none of its text cut short by an ellipsis
    const full = (part: Element) => {
      let width = part.getBoundingClientRect().width;
      for (const t of [part, ...part.querySelectorAll('*')]) {
        const cut = t.scrollWidth - t.clientWidth;
        if (cut > 0 && getComputedStyle(t).textOverflow === 'ellipsis') width += cut;
      }
      return width;
    };
    // What the row needs: the start at full width, the centre nothing (it shrinks first), the end
    // as it is, and the gaps between them
    const needOf = () => {
      const cs = getComputedStyle(el);
      const places = [...el.children];
      let need = Math.max(0, places.length - 1) * px(cs.columnGap);
      for (const place of places) {
        if (place.matches('.center')) continue;
        if (place.matches('.end')) {
          need += place.getBoundingClientRect().width;
          continue;
        }
        const parts = [...place.children];
        need += Math.max(0, parts.length - 1) * px(getComputedStyle(place).columnGap);
        for (const part of parts) need += full(part);
      }
      return need;
    };
    const write = (next: 0 | 1 | 2) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (level === next) return;
        level = next;
        // Measured again in the new form
        tick().then(read);
      });
    };
    const read = () => {
      const now = untrack(() => level);
      const cs = getComputedStyle(el);
      const room = el.clientWidth - px(cs.paddingLeft) - px(cs.paddingRight);
      needs[now] = needOf();
      // The lowest level that fits, among those measured up to this one; half a pixel for the
      // rounding of clientWidth
      for (let l = 0; l <= now; l++) {
        const need = needs[l];
        if (need !== undefined && need - room <= 0.5) {
          write(l as 0 | 1 | 2);
          return;
        }
      }
      // Nothing fits: the next level, or, at the last, the brand's ellipsis
      write(now < 2 ? ((now + 1) as 1 | 2) : now);
    };
    const ro = new ResizeObserver(read);
    ro.observe(el);
    // When the content changes (and when a level changes it), the row is measured again
    const mo = new MutationObserver(read);
    mo.observe(el, { subtree: true, childList: true, characterData: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  });
</script>

<header class="topbar" data-role="toolbar" data-h="toolbar" bind:this={root}>
  <div class="side start">
    {@render lead?.()}
    {#if brand}
      {#if brandMenu || menu}
        <Dropdown menu align="start" role="box">
          {#snippet trigger(toggle, open)}
            <button
              class="brand menu"
              type="button"
              data-h="button-sm"
              aria-label={brandLabel}
              aria-haspopup="menu"
              aria-expanded={open}
              onclick={toggle}
            >
              <span class="t">{brand}</span><Icon name="chevron-down" />
            </button>
          {/snippet}
          {#snippet panel(close)}
            {#if brandMenu}
              {@render brandMenu(close)}
            {:else if menu}
              <MenuList items={menu} onselect={onmenu} onclose={close} />
            {/if}
          {/snippet}
        </Dropdown>
      {:else if brandHref}
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
      {#if presence}<div class="group">{@render presence({ compact: level >= 1 })}</div>{/if}
      {#if end}<div class="group">{@render end({ compact: level >= 2 })}</div>{/if}
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
  // The centre shrinks first; then the presence and the actions are compacted (in script), and only
  // then the start shrinks, its crumbs and its brand cut short with an ellipsis
  .side {
    display: flex;
    align-items: center;
    gap: gap(sm);
    flex: 0 1 auto;
    min-width: 0;
  }
  .start {
    overflow: hidden;
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
  // The brand: the application's name at the size of h2, text in a control, a little tighter
  // (--kata-topbar-brand-tracking, -0.01em unless the page sets it)
  .brand {
    display: inline-flex;
    align-items: center;
    height: h(button-sm);
    @include text(h2);
    letter-spacing: var(--kata-topbar-brand-tracking, -0.01em);
    color: color(text);
    text-decoration: none;
    flex: 0 1 auto;
    min-width: 0;
    // The last resort when the row does not fit even compacted
    .t {
      display: block;
      @include trim;
      @include ellipsis;
    }
    &:hover {
      text-decoration: none;
    }
  }
  // The trigger of the application's menu: a control without a line or padding, so the name
  // stays where the brand is; the chevron is gap-2xs after it
  .brand.menu {
    gap: gap(2xs);
    border: 0;
    padding: 0;
    background: none;
    font-family: inherit;
    cursor: pointer;
    &:hover {
      color: color(muted);
    }
    @include focus-inside;
  }
</style>
