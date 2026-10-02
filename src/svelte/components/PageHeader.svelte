<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';

  // PageHeader: the head of a page, a group of text without a height of its own: an optional trail
  // of links (caption), gap-md, the title (h1) with an optional borderless icon button beside it,
  // gap-xs, and an optional note that applies to the whole page (caption). The button beside the
  // title takes width but no height: it overlaps the centre of the title's ink, so that the line is
  // as tall with it as without it. The Page holds the distance to the content. Actions and tools do
  // not go in the head; they start the content.
  //
  //   <PageHeader title="Notifications" note="Messages sent to you.">
  //     {#snippet crumbs()}<a href="/">Home</a>{/snippet}
  //     {#snippet titleEnd()}…an icon button…{/snippet}
  //   </PageHeader>
  let {
    title,
    note,
    crumbs,
    titleEnd,
  }: {
    title: string;
    /** One sentence under the title that applies to the whole page */
    note?: string;
    /** The trail of links above the title */
    crumbs?: Snippet;
    /** A borderless icon button on the right of the title (rename, a menu) */
    titleEnd?: Snippet;
  } = $props();
</script>

<div class="header" data-role="h1">
  <Stack gap="md">
    {#if crumbs}<div class="crumbs" data-role="caption">{@render crumbs()}</div>{/if}
    <Stack gap="xs">
      {#if titleEnd}
        <div class="title" data-role="h1">
          <Text role="h1" clamp>{title}</Text>
          <div class="side">{@render titleEnd()}</div>
        </div>
      {:else}
        <Text role="h1" clamp>{title}</Text>
      {/if}
      {#if note}<Text role="caption">{note}</Text>{/if}
    </Stack>
  </Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .header {
    min-width: 0;
    @include scope-box(button);
  }
  // The trail: caption text; an icon and a word are 2xs apart
  .crumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm) gap(2xs);
    @include text(caption);
    color: color(muted);
    min-width: 0;
    > :global(a) {
      color: inherit;
    }
    > :global(svg) {
      flex: none;
      color: color(faint);
    }
  }
  // The title shrinks and clips to one line; the button beside it keeps its size
  .title {
    display: flex;
    align-items: center;
    gap: gap(sm);
    min-width: 0;
    > :global(*) {
      flex: none;
    }
    > :global([data-role='h1']) {
      flex: 0 1 auto;
    }
  }
  // The button takes width but no height: it overlaps the centre of the title, out of a slot of
  // height 0, as the action of a SectionHeader does
  .side {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: 0;
    overflow: visible;
  }
</style>
