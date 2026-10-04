<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Section: a titled part of a page (settings, forms). The head is the title (h2) with an optional
  // status on the right (saving, saved), gap-xs, then an optional note that applies to the whole
  // section. gap-lg separates the head from the content; it is never smaller than the gaps inside
  // the content. The content's children are gap apart (lg between fields, md for text and lists).
  //
  // The status is the only thing on the right of the title. Actions that create something go in a
  // Row at the start of the content, and a count goes in a caption at its end.
  //
  // Sections own the breaks between them, so they are stacked with gap 0: each has gap-lg below
  // (0 for the last one), and each one after the first draws a line above with pad-lg under it.
  // A section whose content ends with a List or a Tree is flush: the last item's lower padding is
  // part of the distance, so the section keeps only the rest (gap-sm).
  //
  //   <Stack gap={0}>
  //     <Section title="General" status="Saved">…</Section>
  //     <Section title="Members" gap="md" flush>…</Section>
  //   </Stack>
  type Gap = 0 | 'sm' | 'md' | 'lg';
  let {
    title,
    note,
    status,
    gap = 'lg',
    flush = false,
    children,
  }: {
    title: string;
    /** One sentence that applies to the whole section, under the title */
    note?: string;
    /** A short status on the right of the title */
    status?: string;
    /** The content ends with a List or a Tree */
    flush?: boolean;
    /** The distance between the content's children (default lg) */
    gap?: Gap;
    children: Snippet;
  } = $props();
</script>

<section class="kata-section" class:flush data-role="section">
  <Stack gap="lg">
    <Stack gap="xs">
      <div class="head" data-role="row-inline">
        <h2 class="title">{title}</h2>
        {#if status}<span class="status">{status}</span>{/if}
      </div>
      {#if note}<p class="note" data-role="caption" data-ink>{note}</p>{/if}
    </Stack>
    <div class="body">
      <Stack {gap}>{@render children()}</Stack>
    </div>
  </Stack>
</section>

<style lang="scss">
  @use '../styles/kata' as *;

  .kata-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
    // The break below is a layout distance, so it is on the rem scale
    padding-bottom: gap(lg); /* kata-allow-gap-padding */
    @include scope-box(button);
  }
  .kata-section.flush {
    padding-bottom: gap(sm); /* kata-allow-gap-padding */
  }
  // The page's margin takes over below the last section
  .kata-section:last-child {
    padding-bottom: 0;
  }
  // Every section after the first draws the line; pad-lg under it, to the trimmed title
  .kata-section:not(:first-child) {
    padding-top: pad(lg);
  }
  .kata-section + :global(.kata-section) {
    border-top: bw() solid color(line);
  }
  // The title's ink sits at the top of the head, so the distance from a line or a tab's underline
  // above it is measured from the ink
  .title {
    @include text(h2);
    @include trim-start;
    margin: 0;
    min-width: 0;
  }
  // The content lines up with the page's text, and its first and last lines are trimmed: above it
  // is the head, below it a line or the end of the page
  .body {
    min-width: 0;
    --kata-inset: 0px;
    @include edge(1, 1);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
  }
  .status {
    @include text(caption);
    color: color(muted);
  }
  .note {
    @include text(caption);
    color: color(muted);
    margin: 0;
    min-width: 0;
  }
</style>
