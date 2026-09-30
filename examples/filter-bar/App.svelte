<script lang="ts">
  import { FilterBar, type FilterBarItem, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let items = $state<FilterBarItem[]>([
    { kind: 'filter', id: 'kind', label: 'Kind is shape' },
    { kind: 'word', text: 'and' },
    { kind: 'word', text: '(' },
    { kind: 'filter', id: 'color', label: 'Color is red' },
    { kind: 'word', text: 'or' },
    { kind: 'filter', id: 'size', label: 'Width is more than 40' },
    { kind: 'word', text: ')' },
  ]);
  let edited = $state('');

  // The application removes the filter and the word that joined it
  const joins = (it?: FilterBarItem) =>
    it?.kind === 'word' && (it.text === 'and' || it.text === 'or');
  function remove(id: string) {
    const i = items.findIndex((it) => it.kind === 'filter' && it.id === id);
    if (i < 0) return;
    const from = joins(items[i - 1]) ? i - 1 : i;
    const to = from === i && joins(items[i + 1]) ? i + 2 : i + 1;
    items = [...items.slice(0, from), ...items.slice(to)];
  }
</script>

<Example>
  <Case label="Filters joined by words, a group in brackets; press a filter or its ✕">
    <Surface width="35rem">
      <FilterBar
        sentence="Rows that match these filters"
        {items}
        onedit={(id) => (edited = id)}
        onremove={remove}
      />
    </Surface>
    {#if edited}<Text role="caption">Edit the filter {edited}</Text>{/if}
  </Case>
  <Case label="A narrow column: the line wraps">
    <Surface width="16rem">
      <FilterBar
        sentence="Rows that match all of these"
        items={[
          { kind: 'filter', id: 'a', label: 'Kind is shape' },
          { kind: 'word', text: 'and' },
          { kind: 'filter', id: 'b', label: 'A filter with a long description' },
        ]}
      />
    </Surface>
  </Case>
</Example>
