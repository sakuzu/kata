# TreeRow

TreeRow is one row of a [Tree](tree.md): a [ListItem](list-item.md)
indented by its depth, with a chevron, a name and actions.

## When to use

Use it inside a Tree only. Pass `expandable` for a row with children and
bind `expanded`, or handle `ontoggle` when the application keeps the
state. Put the name, with a mark before it, in the children and the
actions in `end`. In a tree that is reordered with
[sortable](sortable.md), pass `data-sortable-item` and `data-id` (and
`data-kind`) to the row.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `depth` | `0` | The depth, from 0 |
| `expandable` | `false` | The row has children and shows the chevron |
| `expanded` | `false` | The children show (bindable) |
| `ontoggle` | | Called with the new state when the chevron is pressed |
| `grip` | `true` | Shows the grip on hover (false where nothing is reordered) |
| `gripShow` | `false` | Always shows the grip, for screens without hover |
| `sel` | `false` | Selected |
| `hidden` | `false` | The row hides what it stands for: dimmed |
| `dimmed` | `false` | A parent is hidden: dimmed |
| `dragging` | `false` | The row is being dragged: dimmed |
| `onclick` | | Called when the row is pressed |
| `children` | required | The name, and a mark before it |
| `end` | | The actions on the right (a snippet) |

Other attributes (`data-*`, `aria-*`) go to the row.

## Contract

The row is a ListItem: its height comes from its content, at least the
tree's least height, and pad-md plus depth × pad-md on the left. Its
columns are fixed: the chevron, the name, the kept actions. The chevron's
place, the square of an icon button, is kept on a row that does not
open, so nothing moves when a row gains children; a flat tree removes
it. The name is one line, trimmed to its ink and clipped at the end of
its column; a name in a [Text](text.md) with `clamp` ends with an
ellipsis and shows in full on hover. The grip
shows on hover and focus, gap-2xs left of the first thing the row shows,
over the padding. Only an action marked `data-keep` (a state other than
its default, such as a hidden eye) keeps a place: it always shows, at
the right end, and its width is taken from the name. The other actions
keep no place: on hover and focus they show over the end of the row,
gap-sm before the kept ones, on an opaque ground (the surface the row
sits on, under the row's own surface), and `data-open` on the row keeps
them while a menu of the row is open: the row listens for the bubbling `kata-menu-toggle`
event of a [Dropdown](dropdown.md) (and so a Kebab or a Popover) among
its actions and has `data-open` while one is open. A selected row has
the raise surface and a double blue line along its left edge; `hidden`,
`dimmed` and `dragging` dim the row. A row with `onclick` is pressed with a
click, Enter or Space; the right and left arrow keys open and close it,
and the chevron never presses the row.

## Example

[TreeRow](../../examples/tree-row/)
