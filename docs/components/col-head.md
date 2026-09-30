# ColHead

ColHead is the content of a table's column header: the column's name,
which sorts the table when pressed.

## When to use

Put it in a `th` of a [Table](table.md). A column that cannot be sorted
takes no `onsort`. A press asks for the next direction: the column's
`first` direction when the table is not sorted by it yet (a column of
dates starts with `desc`), then the other one. The application sorts the
rows and sets `aria-sort` on the `th`. A column that can be sorted has a
column menu with the two directions and, for the sort key, clearing the
sort (`onsort(null)`); `menu` adds the application's own
[MenuItems](menu-item.md). Two columns merged into one on a narrow
screen pass `sorts` and `onsortKey`; their menu holds `menu` only.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `dir` | | The direction when the table is sorted by this column |
| `onsort` | | Called with the next direction |
| `first` | `asc` | The first direction of the column |
| `sorts` | | The names of merged columns (below) |
| `onsortKey` | | Called with a merged column's id and direction |
| `menu` | | Items of the column menu; receives the close function |
| `children` | | The name |

Each item of `sorts` has `id` and `label`, and optionally `dir`,
`first`, and `sortable: false` for a name that cannot be pressed.

## Contract

The name has the height of a small button and no padding at the sides,
so that it lines up with the text of the column; it is trimmed to its
ink and underlines on hover. The sort key shows a blue chevron after the
name, down for descending and up for ascending, and its name is in the
text colour. The column menu is a ghost icon button (a chevron) at the
right end of the header, which opens a [Dropdown](dropdown.md) menu; the
current direction has a check mark. The names of merged columns stack,
touching. The words of the menu come from the messages `actions`,
`sortAscending`, `sortDescending` and `clearSort`.

## Example

[ColHead](../../examples/col-head/)
