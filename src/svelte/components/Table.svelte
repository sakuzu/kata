<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { overflowEdges } from '../lib/overflowEdges.js';

  // Table: rows of values in aligned columns. The column headers are the body size in the heavy
  // weight, with a line under them and the height of a list item. A cell is at least as tall as a
  // list item of text; stacked content (a Stack) makes it grow to the content and md above and
  // below. Rows line up by column, so a table whose columns hold things of different heights
  // raises the least height with rows: mark (a mark), box (a control with an outline, a small
  // button inside), thumb (a thumbnail) or two (a title and a caption). Cells have pad-sm at the
  // sides, the outer columns pad-md.
  //
  // The author writes <tr> and <td>. A column of numbers takes data-align="end" on its cells, a
  // column of long text data-clamp, a column of row numbers data-idx. A column header holds text
  // or a ColHead. A selected row is <tr aria-selected="true"> (the raise surface and a blue line of
  // two at the left); a row that opens something on a press has a tabindex and the pointer.
  //
  //   <Table>
  //     {#snippet head()}<th>Name</th><th data-align="end">Size</th>{/snippet}
  //     <tr><td>Report</td><td data-align="end">1.2 MB</td></tr>
  //   </Table>
  let {
    head,
    children,
    rows,
    dividers = false,
    sticky = false,
    fill = false,
    el = $bindable(),
    onscroll,
  }: {
    /** The column headers (th) */
    head: Snippet;
    /** The rows (tr) */
    children: Snippet;
    /** The least height of the rows, named after what they hold */
    rows?: 'mark' | 'box' | 'thumb' | 'two';
    /** Lines between the column headers (a table of data) */
    dividers?: boolean;
    /** Keeps the first column at the left while the table scrolls sideways */
    sticky?: boolean;
    /** Fills its container and scrolls both ways itself; the column headers stay at the top */
    fill?: boolean;
    /** The element that scrolls */
    el?: HTMLElement;
    /** Called when it scrolls */
    onscroll?: (e: Event) => void;
  } = $props();
</script>

<div class="wrap" class:fill bind:this={el} {onscroll} data-role="table" {@attach overflowEdges()}>
  <table class="table" class:dividers class:sticky data-role="table" data-rows={rows}>
    <thead><tr>{@render head()}</tr></thead>
    <tbody>{@render children()}</tbody>
  </table>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // A table wider than its frame scrolls sideways, and a line marks the edge that has more
  .wrap {
    min-width: 0;
    overflow-x: auto;
    @include overflow-edges;
  }
  .fill {
    height: 100%;
    overflow: auto;
  }
  // The headers stay at the top of the container. A collapsed border does not stay with a sticky
  // cell, so the line is an inset shadow, and the cell takes the surface it sits on so that the rows
  // do not show through
  .fill :global(thead th) {
    position: sticky;
    top: 0;
    z-index: 1;
    background: color(surface);
    box-shadow: inset 0 calc(#{bw()} * -1) 0 color(line);
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    @include text(body);
    @include scope-box(button-sm);
    @include rows;
  }
  .table :global(th:first-child),
  .table :global(td:first-child) {
    padding-left: pad(md);
  }
  .table :global(th:last-child),
  .table :global(td:last-child) {
    padding-right: pad(md);
  }
  .sticky :global(th:first-child),
  .sticky :global(td:first-child) {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: color(surface);
  }
  .sticky :global(tr:hover td:first-child),
  .sticky :global(tr[aria-selected='true'] > td:first-child) {
    background-color: color(surface);
    background-image: linear-gradient(#{color(raise)}, #{color(raise)});
  }
  .dividers :global(th + th) {
    border-left: bw() solid color(line);
  }
  .table :global(th > [data-role='row-inline']) {
    justify-content: space-between;
  }
  // A header: text inside a cell, trimmed to its ink
  .table :global(th) {
    text-align: start;
    font-weight: 600;
    height: h(list-item);
    padding-inline: pad(sm);
    border-bottom: bw() solid color(line);
    white-space: nowrap;
    @include trim;
  }
  // Cells do not wrap: the table scrolls sideways, and long text ends with an ellipsis
  // (data-clamp)
  .table :global(td) {
    white-space: nowrap;
    height: var(--kata-list-item-height, #{h(list-item)});
    padding-inline: pad(sm);
    border-bottom: bw() solid color(line);
    vertical-align: middle;
    @include trim;
  }
  // Stacked content keeps md above and below, and the cell grows to fit
  .table :global(td > .stack) {
    padding-block: pad(md);
  }
  .table :global(tr[tabindex]) {
    cursor: pointer;
  }
  .table :global(tbody tr:hover td) {
    background: color(raise);
  }
  .table :global(tr[aria-selected='true'] > td) {
    background: color(raise);
  }
  .table :global(tr[aria-selected='true'] > td:first-child) {
    box-shadow: inset 2px 0 0 color(blue-ink);
  }
  .table :global(th[data-align='end']),
  .table :global(td[data-align='end']) {
    text-align: end;
    font-variant-numeric: tabular-nums;
  }
  .table :global(td[data-clamp]) {
    max-width: 12rem;
    @include ellipsis;
  }
  .table :global(th[data-idx]),
  .table :global(td[data-idx]) {
    width: 2.5rem;
    text-align: end;
    color: color(muted);
    font-variant-numeric: tabular-nums;
  }
</style>
