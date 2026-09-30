<script lang="ts">
  // A tree of two groups whose rows are reordered with sortable, for the tests of Tree
  import Tree from '../../src/svelte/components/Tree.svelte';
  import TreeRow from '../../src/svelte/components/TreeRow.svelte';
  import { type SortMove, sortable } from '../../src/svelte/sortable.js';

  let { onDrop }: { onDrop?: (m: SortMove) => void } = $props();

  let groups = $state([
    { id: 'g1', name: 'First', open: true, items: ['a', 'b'] },
    { id: 'g2', name: 'Second', open: false, items: ['c'] },
  ]);

  function move(m: SortMove) {
    onDrop?.(m);
    const from = groups.find((g) => g.id === m.from);
    const to = groups.find((g) => g.id === m.to);
    if (!from || !to) return;
    const [id] = from.items.splice(m.oldIndex, 1);
    to.items.splice(m.newIndex, 0, id);
  }
</script>

<Tree label="Contents">
  {#each groups as g (g.id)}
    <TreeRow expandable bind:expanded={g.open}>{g.name}</TreeRow>
    <div
      data-testid={g.id}
      hidden={!g.open}
      use:sortable={{ group: 'rows', containerId: g.id, onDrop: move }}
    >
      {#each g.items as id (id)}
        <TreeRow data-sortable-item data-id={id} depth={1}>Row {id}</TreeRow>
      {/each}
    </div>
  {/each}
</Tree>
