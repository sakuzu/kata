<script lang="ts">
  import '../styles/components.css';
  import { tokenPx } from '../lib/tipPlace.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  // Pager: pages by number, at the end of a list: ‹ 1 … 4 5 6 … 12 ›. It shows the first and the
  // last page and one page on each side of the current one; the pages between become "…". The
  // numbers and the arrows are ghost icon buttons (squares of a small button: the area that is
  // pressed and the hover surface are that square), gap-md apart; the current page has the
  // selected surface, and "…" sits in a square of the same size. Every item keeps its square:
  // nothing in the row shrinks. Nothing shows for a single page.
  // It never wraps: when the pages do not fit in its width, the neighbours of the current page go
  // (‹ 1 … 5 … 12 ›), and when even that does not fit, the pager scrolls sideways. How pages map
  // to the application's data (a cursor, an offset) is the application's.
  //
  //   <Pager page={3} pages={12} onchange={(p) => load(p)} />
  let {
    page,
    pages,
    onchange,
  }: {
    /** The current page, from 1 */
    page: number;
    /** The number of pages */
    pages: number;
    /** Called with the page that is asked for */
    onchange: (page: number) => void;
  } = $props();

  // The pages that show, in order; a gap between them becomes "…"
  function list(shown: number[]): (number | '…')[] {
    const out: (number | '…')[] = [];
    const keep = new Set(shown.filter((n) => n >= 1 && n <= pages));
    let prev = 0;
    for (const n of [...keep].sort((a, b) => a - b)) {
      if (n - prev > 1) out.push('…');
      out.push(n);
      prev = n;
    }
    return out;
  }
  // The first, the last, and the current page with one on each side
  const full = $derived(list([1, pages, page - 1, page, page + 1]));
  // The compact form: the first, the current and the last page
  const compact = $derived(list([1, page, pages]));

  // Which form fits: every item (the numbers, "…" and the arrows) is the square of an icon button,
  // gap-md apart, so the width of a form follows from its count. The square is read from its token
  // (--kata-height-icon-button), not from a drawn box. It is read when the pager changes size, and
  // written in the next animation frame
  let nav = $state<HTMLElement>();
  let fit = $state<'full' | 'compact' | 'scroll'>('full');
  $effect(() => {
    const el = nav;
    if (!el) return;
    const counts = { full: full.length + 2, compact: compact.length + 2 };
    const read = () => {
      const square = tokenPx('--kata-height-icon-button', el);
      const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
      const width = (n: number) => n * square + (n - 1) * gap;
      // Half a pixel of room for rounding
      const room = el.clientWidth + 0.5;
      if (width(counts.full) <= room) return 'full';
      return width(counts.compact) <= room ? 'compact' : 'scroll';
    };
    fit = read();
    if (typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      const next = read();
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (next !== fit) fit = next;
      });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  });
  const items = $derived(fit === 'full' ? full : compact);
</script>

{#if pages > 1}
  <nav
    class="pager"
    data-role="row-inline"
    data-scroll={fit === 'scroll' ? '' : undefined}
    aria-label={getMessages().pagination}
    bind:this={nav}
  >
    <Button
      variant="ghost"
      icon
      aria-label={getMessages().previousPage}
      disabled={page <= 1}
      onclick={() => onchange(page - 1)}
    >
      <Icon name="chevron-left" />
    </Button>
    {#each items as it, i (typeof it === 'number' ? it : `gap-${i}`)}
      {#if it === '…'}
        <span class="gap" data-h="icon-button" aria-hidden="true"><span class="t">…</span></span>
      {:else}
        <Button
          variant="ghost"
          icon
          on={it === page}
          aria-label={getMessages().page({ page: it })}
          aria-current={it === page ? 'page' : undefined}
          onclick={() => onchange(it)}
        >
          <span class="t">{it}</span>
        </Button>
      {/if}
    {/each}
    <Button
      variant="ghost"
      icon
      aria-label={getMessages().nextPage}
      disabled={page >= pages}
      onclick={() => onchange(page + 1)}
    >
      <Icon name="chevron-right" />
    </Button>
  </nav>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .pager {
    display: flex;
    align-items: center;
    gap: gap(md);
    flex-wrap: nowrap;
    min-width: 0;
    @include text(body);
    // Every item keeps its square
    > :global(*) {
      flex: none;
    }
  }
  .pager[data-scroll] {
    overflow-x: auto;
  }
  // "…" tells that more pages follow, so it is muted, not faint
  .gap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(icon-button);
    height: h(icon-button);
    color: color(muted);
  }
  // Figures inside a control: trimmed to their ink, centred, of equal width
  .t {
    display: block;
    font-variant-numeric: tabular-nums;
    @include trim;
  }
</style>
