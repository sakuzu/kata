# Tree

Tree is a list with depth: rows that open and close, and that can be
reordered by dragging.

## When to use

Use it for things that contain other things, such as the contents of a
document in a [Panel](panel.md). It holds [TreeRow](tree-row.md) and
[DropLine](drop-line.md) only. Pass `flat` for a list where no row
opens. To reorder by dragging, put the [sortable](sortable.md) action on
the elements that hold the rows. Items of one kind that neither nest
nor move are a [List](list.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | | The name of the tree |
| `flat` | `false` | No row opens: no room for the chevron |
| `rows` | | The least height of every row: `mark`, `box`, `thumb` or `two` |
| `children` | required | The rows |

## Contract

The rows touch; the tree's outline is the edges of its rows, and the
distance to what is around it belongs to the Stack it is in. The depth
of a row is its own `depth`, so the elements between the tree and its
rows may be flat, or nested in groups that are reordered separately; a
group needs no distance of its own. In a `flat` tree the rows keep no
room for the chevron, so their text starts where the head of a
[SectionHeader](section-header.md) does. A row takes its height from its
content; `rows` raises the least height of every row to the height of a
list item with a mark, a control, a thumbnail or two lines, so that rows
with different content are the same height.

## Example

[Tree](../../examples/tree/)
