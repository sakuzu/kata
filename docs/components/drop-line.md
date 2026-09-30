# DropLine

DropLine shows where a dragged row will land.

## When to use

Put it between two rows of a [Tree](tree.md), or of a list, while a row
is dragged, at the depth of the place it marks. With
[sortable](sortable.md), the place is shown on the row that moves
instead, and a DropLine is for drags the application handles itself.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `depth` | `0` | The depth of the place, from 0 |

## Contract

A blue line twice the width of a line, with a gap-xs square at its left
end. The element has no height and the line is centred on the boundary
between the two rows, so the rows do not move. It starts where the
content of a row of that depth starts: pad-md plus depth × pad-md from
the left. It is hidden from assistive technology.

## Example

[DropLine](../../examples/drop-line/)
