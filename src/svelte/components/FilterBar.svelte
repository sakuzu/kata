<script lang="ts" module>
  /** One piece of a FilterBar: a filter, or a word between filters */
  export type FilterBarItem =
    | { kind: 'filter'; id: string; label: string }
    | { kind: 'word'; text: string };
</script>

<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Chip from './Chip.svelte';
  import Icon from './Icon.svelte';
  import Text from './Text.svelte';

  // FilterBar: a summary of the filters in effect, under the head of a table or a list. It is for
  // reading; the filters are built elsewhere (a modal). Pressing a filter calls onedit, and its ✕
  // calls onremove. The application writes the pieces: a sentence on how to read the filters, then
  // one line of filters and the words between them ("and", "or", brackets around a group), which
  // wraps when it does not fit. It is a container with pad-md, the two lines gap-sm apart, on the
  // raise surface with a line along the bottom, and small buttons inside; each filter is a Chip.
  // With no filter in effect the application does not show it.
  //
  //   <FilterBar sentence="Rows that match all of these" {items} onedit={open} onremove={drop} />
  let {
    sentence,
    items,
    onedit,
    onremove,
  }: {
    /** How to read the filters, one sentence */
    sentence: string;
    /** The filters and the words between them, in order */
    items: FilterBarItem[];
    /** Called with the id of the filter that is pressed */
    onedit?: (id: string) => void;
    /** Called with the id of the filter whose ✕ is pressed */
    onremove?: (id: string) => void;
  } = $props();
</script>

<div class="bar" data-inset data-role="filter-bar" role="group" aria-label={getMessages().filters}>
  <div class="lead">
    <Icon name="funnel" tone="muted" />
    <Text role="caption">{sentence}</Text>
  </div>
  <div class="line">
    {#each items as it, i (i)}
      {#if it.kind === 'filter'}
        <Chip
          onclick={() => onedit?.(it.id)}
          onremove={onremove ? () => onremove?.(it.id) : undefined}
          removeLabel={getMessages().removeFilter({ label: it.label })}>{it.label}</Chip
        >
      {:else}
        <Text role="caption" as="span">{it.text}</Text>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .bar {
    display: flex;
    flex-direction: column;
    gap: gap(sm);
    flex: none;
    min-width: 0;
    @include container;
    background: color(raise);
    border-bottom: bw() solid color(line);
    @include scope-box(button-sm);
  }
  .lead {
    display: flex;
    align-items: center;
    gap: gap(sm);
    min-width: 0;
  }
  // The filters and the words: one line that wraps
  .line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
  }
</style>
