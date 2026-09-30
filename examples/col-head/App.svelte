<script lang="ts">
  import { ColHead, Table } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  type Key = 'name' | 'updated';
  let key = $state<Key>('name');
  let dir = $state<'asc' | 'desc'>('asc');
  const rows = [
    { name: 'Budget draft', updated: '2026-09-01', kind: 'Sheet' },
    { name: 'Quarterly report', updated: '2026-09-28', kind: 'Document' },
    { name: 'Site survey', updated: '2026-09-15', kind: 'Drawing' },
  ];
  const sorted = $derived(
    [...rows].sort((a, b) => (dir === 'asc' ? 1 : -1) * a[key].localeCompare(b[key])),
  );
  function sortBy(k: Key, d: 'asc' | 'desc' | null) {
    key = k;
    dir = d ?? 'asc';
  }
  const aria = (k: Key) => (key === k ? (dir === 'asc' ? 'ascending' : 'descending') : undefined);
</script>

<Example>
  <Case label="Press a name to sort; a column of dates starts descending; Kind is not sorted">
    <Surface>
      <Table>
        {#snippet head()}
          <th aria-sort={aria('name')}>
            <ColHead dir={key === 'name' ? dir : undefined} onsort={(d) => sortBy('name', d)}>Name</ColHead>
          </th>
          <th aria-sort={aria('updated')}>
            <ColHead dir={key === 'updated' ? dir : undefined} first="desc" onsort={(d) => sortBy('updated', d)}
              >Updated</ColHead
            >
          </th>
          <th><ColHead>Kind</ColHead></th>
        {/snippet}
        {#each sorted as r (r.name)}
          <tr><td>{r.name}</td><td>{r.updated}</td><td>{r.kind}</td></tr>
        {/each}
      </Table>
    </Surface>
  </Case>
  <Case label="Two columns merged into one">
    <Surface width="20rem">
      <Table>
        {#snippet head()}
          <th>
            <ColHead
              sorts={[
                { id: 'name', label: 'Name', dir: key === 'name' ? dir : undefined },
                {
                  id: 'updated',
                  label: 'Updated',
                  dir: key === 'updated' ? dir : undefined,
                  first: 'desc',
                },
              ]}
              onsortKey={(id, d) => sortBy(id as Key, d)}
            />
          </th>
        {/snippet}
        {#each sorted as r (r.name)}
          <tr><td>{r.name}</td></tr>
        {/each}
      </Table>
    </Surface>
  </Case>
</Example>
