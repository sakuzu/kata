<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // Tcard: one row of a table, folded into a card for a narrow screen. The names of the columns
  // and the values sit in two columns, a name 6rem wide and its value, gap-sm between the rows
  // (measured from the trimmed ink) and gap-md between the columns; pad-md inside a line. Below
  // 48rem the two columns fold into one: a name sits gap-xs above its value, and pad-sm more lies
  // above the next name. The children are pairs of <dt> (the name) and <dd> (the value); an empty
  // value still takes one line. Controls do not go in a value: the row's actions go in foot.
  //
  // On a wide screen the same rows are a Table. Inside Tcards (a scrolling column of cards) the
  // card is placed at y. A card that is pressed takes role, tabindex and onclick.
  //
  //   <Tcard sel={picked}>
  //     <dt>Name</dt><dd>Laptop</dd>
  //     <dt>Last used</dt><dd>2026-09-12</dd>
  //     {#snippet foot()}<Button variant="danger">Revoke</Button>{/snippet}
  //   </Tcard>
  let {
    sel = false,
    y,
    foot,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'style'> & {
    /** Selected: the raise surface and a blue line of two at the left */
    sel?: boolean;
    /** The distance from the top of Tcards, in px (a virtual scroll) */
    y?: number;
    /** The row's actions, at the bottom right */
    foot?: Snippet;
    /** Pairs of dt and dd */
    children: Snippet;
  } = $props();
</script>

<div
  class="wrap"
  class:sel
  class:placed={y !== undefined}
  style:transform={y === undefined ? undefined : `translateY(${y}px)`}
  data-role="table"
  {...rest}
>
  <dl class="tcard">{@render children()}</dl>
  {#if foot}<div class="foot">{@render foot()}</div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .wrap {
    border: bw() solid color(line);
    padding: pad(md);
    min-width: 0;
    @include text(body);
    @include scope-box(button);
  }
  .wrap[tabindex] {
    cursor: pointer;
    @include focus-inside;
  }
  // md above the actions, measured from their outline
  .foot {
    display: flex;
    justify-content: flex-end;
    padding-top: pad(md);
  }
  .tcard {
    display: grid;
    grid-template-columns: 6rem minmax(0, 1fr);
    gap: gap(sm) gap(md);
    // A name is level with the first line of its value
    align-items: baseline;
    margin: 0;
    min-width: 0;
    @include scope-box(button-sm);
  }
  // The name is as large as the value, like a pair's. The text is set by its ink, so the rows
  // are measured from the ink too
  .tcard :global(dt) {
    color: color(muted);
    min-width: 0;
    @include trim;
  }
  .tcard :global(dd) {
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
    @include trim;
  }
  .tcard :global(dd:empty::before) {
    content: '\00a0';
  }
  @include narrow {
    .tcard {
      grid-template-columns: minmax(0, 1fr);
      gap: gap(xs) 0;
    }
    .tcard :global(dt) {
      padding-top: pad(sm);
    }
    .tcard :global(dt:first-child) {
      padding-top: 0;
    }
  }
  .wrap.placed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .wrap.sel {
    box-shadow: inset 2px 0 0 color(blue-ink);
    background: color(raise);
  }
</style>
