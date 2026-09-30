<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  // ColHead: the content of a table's column header. The name of the column is at the left;
  // pressing it sorts the table by that column. The column that the table is sorted by shows a
  // blue chevron: up ascending, down descending. The name has the height of a small button and no
  // padding at the sides, so that it lines up with the text of the column. A column that cannot be
  // sorted takes no onsort.
  //
  // A press asks for the next direction: the column's first direction when it is not the sort
  // key yet (ascending by default; a column of dates starts descending), then the other one.
  //
  // Two columns merged into one (on a narrow screen) pass sorts: their names stack, and a press
  // calls onsortKey with the column's id and its next direction.
  //
  //   <th aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}>
  //     <ColHead {dir} first="desc" onsort={(d) => sortBy('updated', d)}>Updated</ColHead>
  //   </th>
  //
  // TODO(kata): uses Dropdown and MenuItem once the overlay family lands: a column menu (▾) at the
  // right end, with the sort directions, clearing the sort and the caller's own items.
  let {
    dir,
    onsort,
    first = 'asc',
    sorts,
    onsortKey,
    children,
  }: {
    /** The direction, when the table is sorted by this column */
    dir?: 'asc' | 'desc';
    /** Called with the next direction when the name is pressed */
    onsort?: (dir: 'asc' | 'desc' | null) => void;
    /** The first direction when the column is not the sort key yet (default asc) */
    first?: 'asc' | 'desc';
    /** The names of merged columns, each with its own direction and first direction; a name
     * with sortable: false cannot be pressed */
    sorts?: {
      id: string;
      label: string;
      dir?: 'asc' | 'desc';
      first?: 'asc' | 'desc';
      sortable?: boolean;
    }[];
    /** Called with the id and the next direction when a merged name is pressed */
    onsortKey?: (id: string, dir: 'asc' | 'desc') => void;
    /** The name of the column */
    children?: Snippet;
  } = $props();

  /** The next direction: the other one for the sort key, else the column's first direction */
  function next(d: 'asc' | 'desc' | undefined, f: 'asc' | 'desc'): 'asc' | 'desc' {
    return d === 'asc' ? 'desc' : d === 'desc' ? 'asc' : f;
  }
</script>

{#snippet mark(d: 'asc' | 'desc' | undefined)}
  {#if d}<span class="mark" class:asc={d === 'asc'}><Icon name="chevron-down" /></span>{/if}
{/snippet}

<span class="head" data-role="row-inline" class:merged={!!sorts}>
  {#if sorts}
    <span class="names">
      {#each sorts as k (k.id)}
        {#if onsortKey && k.sortable !== false}
          <button
            class="name"
            class:on={!!k.dir}
            type="button"
            data-h="button-sm"
            onclick={() => onsortKey(k.id, next(k.dir, k.first ?? 'asc'))}
          >
            <span class="t">{k.label}</span>{@render mark(k.dir)}
          </button>
        {:else}
          <span class="line" data-h="button-sm"><span class="t">{k.label}</span></span>
        {/if}
      {/each}
    </span>
  {:else if onsort}
    <button
      class="name"
      class:on={!!dir}
      type="button"
      data-h="button-sm"
      onclick={() => onsort?.(next(dir, first))}
    >
      <span class="t">{@render children?.()}</span>{@render mark(dir)}
    </button>
  {:else}
    <span class="line" data-h="button-sm"><span class="t">{@render children?.()}</span></span>
  {/if}
</span>

<style lang="scss">
  @use '../styles/kata' as *;

  .head {
    display: flex;
    align-items: center;
    gap: gap(sm);
    min-width: 0;
    text-box: none;
  }
  // The name: a small button's height, no padding at the sides
  .name,
  .line {
    display: inline-flex;
    align-items: center;
    gap: gap(2xs);
    height: h(button-sm);
    min-width: 0;
    border: 0;
    padding: 0;
    background: none;
    font: inherit;
    color: inherit;
    white-space: nowrap;
  }
  .name {
    cursor: pointer;
    &:hover {
      color: color(text);
      text-decoration: underline;
    }
  }
  .on {
    color: color(text);
  }
  // The names of merged columns stack, touching
  .names {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
  }
  .t {
    display: block;
    min-width: 0;
    @include trim;
    @include ellipsis;
  }
  // The sort key: a blue chevron, down for descending, turned up for ascending
  .mark {
    display: inline-flex;
    color: color(blue-ink);
    &.asc {
      transform: rotate(180deg);
    }
  }
</style>
