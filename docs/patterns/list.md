# A list with actions

A list of things that can be found, selected and acted on, one at a
time or together, with pages when there are many.

## When to use

Use it for the documents, the members or the files of a place. When the
things have several values to compare, use a
[Table](../components/table.md); when they are a hierarchy, a
[Tree](../components/tree.md) or a
[LayerTree](../workbench/layer-tree.md).

## Parts

- A [Row](../components/row.md) above the list with a
  [SearchInput](../components/search-input.md) and the action that
  creates a new item. Filters in effect go in a
  [FilterBar](../components/filter-bar.md).
- A [List](../components/list.md) of
  [ListItem](../components/list-item.md)s: a
  [Checkbox](../components/checkbox.md) to select, a mark, the name, a
  muted caption and a [Kebab](../components/kebab.md) for the actions of
  one item.
- A [Bulk](../components/bulk.md) bar while items are selected, with the
  actions on all of them and a button that clears the selection.
- A [Pager](../components/pager.md) at the end of the list.
- A [State](../components/state.md) in place of the list when it is
  empty, or when nothing matches the search, with the action that helps.

## Rules

- The name clips to one line; the full name shows on hover.
- An action on one item is in its Kebab; the same action on several is
  in the Bulk bar. A destructive action asks before it acts.
- An empty list says why it is empty and what to do, in one sentence and
  one action.

## Example

[A list with actions](../../examples/pattern-list/)
