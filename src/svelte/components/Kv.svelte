<script lang="ts">
  import '../styles/components.css';
  import Pair from './Pair.svelte';

  // Kv: a column of read pairs. The pairs sit on one grid, so their names line up in one column:
  // 7.5rem wide, or the width of the longest name with tight (a narrow container such as a tile).
  // Pairs are gap-sm apart. Below 24rem each name sits above its value.
  //
  //   <Kv items={[{ k: 'Length', v: '13.1 km' }, { k: 'ID', v: 'ab12', mono: true }]} />
  //   <Kv tight items={…} />
  let {
    items,
    tight = false,
  }: {
    items: {
      /** The name */
      k: string;
      /** The value */
      v: string;
      mono?: boolean;
      /** The depth in a tree of values */
      indent?: number;
      muted?: boolean;
      clamp?: boolean;
      /** Makes the name a link */
      href?: string;
      /** A caption under the value */
      note?: string;
    }[];
    /** The name column takes the width of the longest name */
    tight?: boolean;
  } = $props();
</script>

<div class="kv" class:tight data-role="list">
  {#each items as item, i (i)}
    <Pair
      read
      label={item.k}
      href={item.href}
      note={item.note}
      {tight}
      indent={item.indent ?? 0}
      muted={item.muted}
      mono={item.mono}
      clamp={item.clamp}>{item.v}</Pair
    >
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The grid holds the columns only; each pair sits on them (subgrid)
  .kv {
    --kata-pair-name: 7.5rem;
    --kata-pair-cols: subgrid;
    display: grid;
    grid-template-columns: var(--kata-pair-name) minmax(0, 1fr);
    row-gap: gap(sm);
    column-gap: gap(sm);
    min-width: 0;
  }
  .tight {
    grid-template-columns: max-content minmax(0, 1fr);
  }
  @include tiny {
    .kv,
    .tight {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
