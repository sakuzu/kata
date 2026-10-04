<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Page: the body of a page. Its margin is gap-lg (gap-md at the sides below 48rem). It holds the
  // head (a PageHeader), then the content, stacked gap-lg apart. From the bottom of the head to the
  // first visible thing of the content (the ink of text, the outline of a control) the distance is
  // always pad-lg, never smaller than the gaps inside the content. The content holds that distance
  // as its own padding, as a section header does:
  //
  // - flush: the content starts with something that reaches the edges (List, Tree, Table, Tabs).
  //   The upper half of the first item is part of the distance, so the padding is the rest, pad-sm.
  // - otherwise: pad-lg, and the first line of text is trimmed to its ink.
  //
  // width="settings" limits the text column to the settings width; full fills the container.
  //
  //   <Page>{#snippet head()}<PageHeader title="Files" />{/snippet}…</Page>
  let {
    width = 'full',
    flush = false,
    head,
    children,
  }: {
    /** full fills the container; settings limits the column to the settings width */
    width?: 'full' | 'settings';
    /** The content starts with a List, Tree, Table or Tabs */
    flush?: boolean;
    /** The head: a PageHeader */
    head?: Snippet;
    children: Snippet;
  } = $props();
</script>

<div
  class="page"
  class:settings={width === 'settings'}
  data-role="block"
  data-page
  data-flush={flush ? '' : undefined}
>
  <Stack gap={0}>
    {#if head}{@render head()}{/if}
    <div class="body" class:flush>
      <Stack gap="lg">{@render children()}</Stack>
    </div>
  </Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .page {
    // The margin of a page is a layout distance, on the rem scale
    padding: gap(lg); /* kata-allow-gap-padding */
    min-width: 0;
    // Items inside line up with the page's text
    --kata-inset: 0px;
  }
  .settings {
    max-width: calc(var(--kata-width-settings) + #{gap(lg)} * 2);
  }
  .body {
    min-width: 0;
    padding-top: pad(lg);
    @include edge(1, 0);
  }
  .body.flush {
    padding-top: pad(sm);
  }
  @include narrow {
    .page {
      padding: gap(lg) gap(md); /* kata-allow-gap-padding */
    }
  }
</style>
