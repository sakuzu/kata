<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  // Pager: pages by number, at the end of a list: ‹ 1 … 4 5 6 … 12 ›. It shows the first and the
  // last page and one page on each side of the current one; the pages between become "…". The
  // numbers and the arrows are ghost icon buttons (squares of a small button: the area that is
  // pressed and the hover surface are that square), gap-md apart; the current page has the
  // selected surface, and "…" sits in a square of the same size. Nothing shows for a single page.
  // How pages map to the application's data (a cursor, an offset) is the application's.
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

  // The first, the last, and the current page with one on each side; a gap becomes "…"
  const items = $derived.by(() => {
    const out: (number | '…')[] = [];
    const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
    let prev = 0;
    for (const n of [...keep].sort((a, b) => a - b)) {
      if (n - prev > 1) out.push('…');
      out.push(n);
      prev = n;
    }
    return out;
  });
</script>

{#if pages > 1}
  <nav class="pager" data-role="row-inline" aria-label={getMessages().pagination}>
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
    flex-wrap: wrap;
    @include text(body);
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
