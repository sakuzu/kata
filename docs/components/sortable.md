# sortable

`sortable` is a Svelte action that lets the user reorder items by
dragging them, within a container and between containers.

## When to use

Use it on the elements that hold the items of a [Tree](tree.md) or of a
list. The application keeps the order in its own data: the action
reports each drop, and the application applies it; the list is then
drawn again from the data.

```svelte
<script>
  import { sortable, Tree, TreeRow } from '@sakuzu/kata/svelte';
  let items = $state([{ id: 'a', name: 'First' }, { id: 'b', name: 'Second' }]);
  function move({ oldIndex, newIndex }) {
    const [item] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, item);
  }
</script>

<Tree label="Contents">
  <div use:sortable={{ group: 'items', containerId: 'root', onDrop: move }}>
    {#each items as item (item.id)}
      <TreeRow data-sortable-item data-id={item.id}>{item.name}</TreeRow>
    {/each}
  </div>
</Tree>
```

## Parameters

| Parameter | Default | Description |
| --- | --- | --- |
| `group` | required | Containers with the same group exchange items |
| `containerId` | required | The id of this container, reported in a move |
| `onDrop` | required | Called with a `SortMove` after a drop |
| `handle` | | A selector for the part that picks an item up |
| `filter` | | A selector for parts that never start a drag |
| `accept` | | Whether it takes an item, from its `(data-kind, data-id)` |
| `enabled` | `true` | `false` turns the container off |
| `onOver` | | Called while dragging with the item under the pointer |

A `SortMove` is `{ itemId, from, to, oldIndex, newIndex }`: the item's
`data-id`, the ids of the two containers and the indexes before and
after. `onOver` receives `{ dragId, dragKind, overId, overKind }` and
then `null` when the drag ends; returning `true` holds the order still,
so that the item under the pointer stays there, for example to open a
closed group after a moment.

## Behaviour

Each item carries `data-sortable-item` and `data-id`, and `data-kind`
when containers accept only some kinds. A movement of less than 10px is
a click, so an item can still be pressed; with `handle`, only that part
picks an item up, which suits touch screens, and parts that match
`filter` (the actions of an item) never start a drag. Right after a drop
the action puts the element back where it was, so that the DOM never
differs from a keyed `each`, and reports the move; a drop in the place
where the item was reports nothing. While dragging, the item that was
picked up has the class `sortchosen` and the place where it would land
`sortghost`; a [TreeRow](tree-row.md) shows them with the raise surface
and a blue outline. The container scrolls when the pointer nears its
edge. The drag is handled by SortableJS.

## Example

[Tree](../../examples/tree/)
