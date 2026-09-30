# DropLine

DropLine shows where a dragged item will land.

## When to use

Use it between two items of a [Tree](tree.md), or of a list, while an
item is dragged, at the depth of the place it marks. With
[sortable](sortable.md), the place is shown on the item that moves
instead, and a DropLine is for drags the application handles itself.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `depth` | `0` | The depth of the place, from 0 |

## Contract

A blue line twice the width of a line, with a gap-xs square at its left
end. The element has no height and the line is centred on the boundary
between the two items, so the items do not move. It starts where the
content of an item of that depth starts: pad-md plus depth × pad-md from
the left. It is hidden from assistive technology.

## Example

[DropLine](../../examples/drop-line/)
