<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // SectionHeader: a titled group inside a panel. The head is the name (label role, trimmed to its
  // ink) with pad-md at the sides and, on the right, an optional action (a small button: an icon
  // button, or a bordered text button). The head has the height of its ink; the action overlaps it
  // without taking height.
  //
  // A head without an action can show a status on the right of the name instead: a short state or
  // a count (caption, muted). With an action the status is not shown. A note is one sentence that
  // applies to the whole group, gap-xs under the name (caption, muted, trimmed to its ink); it is
  // part of the head, so the distance from the head to the content is measured from its ink.
  //
  // The head is closer to its own content than to what comes before: the break above is the lower
  // half of the previous group plus pad-sm (about pad-lg from the previous ink; pad-lg after a
  // line), and the head is pad-md from the content. The content has pad-md on its sides and bottom,
  // so text, fields and pairs go in directly, without a Block. Content that reaches the edges
  // (List, Tree, Table, Disclosure) takes flush (no padding at the sides and below, gap-xs between
  // the ink of the name and the content); with an action, flush content keeps pad-md above it, so
  // that the action that hangs below the head does not reach the first row.
  //
  // Section headers are stacked with gap 0. rule draws a line above, with the same distance from the
  // ink on both sides.
  //
  //   <SectionHeader label="Layers" flush>
  //     {#snippet actions()}…{/snippet}
  //     <List>…</List>
  //   </SectionHeader>
  let {
    label,
    status,
    note,
    actions,
    flush = false,
    rule = false,
    gap = 'sm',
    children,
  }: {
    /** The name of the group */
    label: string;
    /** A short state or count on the right of the name; not shown with actions */
    status?: string;
    /** One sentence that applies to the whole group, under the name */
    note?: string;
    /** The action on the right of the head */
    actions?: Snippet;
    /** The content reaches the edges (List, Tree, Table, Disclosure) */
    flush?: boolean;
    /** Draw a line above */
    rule?: boolean;
    /** The distance between the content's children (default sm; not used with flush) */
    gap?: 0 | 'sm' | 'md';
    children: Snippet;
  } = $props();
</script>

<div
  class="kata-section-header"
  class:flush
  class:rule
  class:acted={!!actions}
  data-role="section-header"
>
  <div class="head" class:noted={!!note} data-role="section-head">
    <span class="label">{label}</span>
    {#if actions}
      <div class="side">{@render actions()}</div>
    {:else if status}
      <span class="status">{status}</span>
    {/if}
    {#if note}<p class="note">{note}</p>{/if}
  </div>
  <div class="body" data-inset={flush ? undefined : true}>
    {#if flush}{@render children()}{:else}<Stack {gap}>{@render children()}</Stack>{/if}
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .kata-section-header {
    @include bundle;
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: none;
    padding-block-start: pad(sm);
    @include scope-box(button);
  }
  // First in its container (right after a toolbar's line), or right after a Divider or the line of
  // Tabs
  .kata-section-header:first-child,
  :global([data-role='rule']) + .kata-section-header,
  :global([data-role='tabs']:where([data-rule])) + .kata-section-header {
    padding-block-start: pad(lg);
  }
  .rule {
    border-top: bw() solid color(line);
    padding-block-start: pad(lg);
  }
  // The same distance on both sides of the line: pad-lg from the ink above, so the group before a
  // ruled one ends with pad-lg (pad-sm after the lower half of a list item)
  :global(.kata-section-header:has(+ .kata-section-header.rule)) > .body {
    padding-bottom: pad(lg);
  }
  :global(.kata-section-header.flush:has(+ .kata-section-header.rule)) > .body {
    padding-bottom: pad(sm);
  }
  .body {
    padding: pad(md);
    min-width: 0;
    --kata-inset: 0px;
  }
  // The first and the last line of the content are trimmed, so the distance from the name is the
  // same whether the content is text, a control or a list item
  .kata-section-header:not(.flush) > .body {
    @include edge(1, 1);
  }
  .flush > .body {
    padding: 0;
    padding-top: gap(xs); /* kata-allow-gap-padding */
    --kata-inset: #{pad(md)};
  }
  .flush.acted > .body {
    padding-top: pad(md);
  }
  // Content that ends with a filled row (a Disclosure) gets the lower half of a list item below it
  .flush > .body > :global([data-role='list-item']:last-child) {
    padding-bottom: pad(md);
  }
  // The head has the height of the name's ink, with pad-md at the sides
  .head {
    display: flex;
    align-items: center;
    gap: gap(sm);
    padding-inline: pad(md);
    min-width: 0;
    @include text(body);
    @include scope-box(button-sm);
  }
  .label {
    flex: 1;
    @include text(label);
    @include trim;
    @include ellipsis;
  }
  // The status is trimmed like the name, so it takes no more height than the name's ink
  .status {
    flex: none;
    @include text(caption);
    color: color(muted);
    @include trim;
    white-space: nowrap;
  }
  // The note takes a line of its own under the name, gap-xs from the name's ink; the head ends at
  // the note's ink
  .noted {
    flex-wrap: wrap;
    row-gap: gap(xs);
  }
  .note {
    flex: 1 0 100%;
    min-width: 0;
    margin: 0;
    @include text(caption);
    color: color(muted);
    @include trim;
  }
  // The action takes width but no height: it overlaps the centre of the name, out of a slot of
  // height 0
  .side {
    display: flex;
    align-items: center;
    gap: gap(sm);
    margin-left: auto;
    height: 0;
    overflow: visible;
  }
</style>
