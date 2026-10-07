# Board

Board is the container of a picker that opens inside a panel, such as a
picker of colors or symbols.

## When to use

Use it for a picker that opens inside a panel, and place its parts in
order: a search, a [Segmented](segmented.md), [Glyphs](glyphs.md). A
picker that opens from a trigger over the page goes in a
[Dropdown](dropdown.md) with `bare`. The bars of a picker
(hue, lightness) are the picker's own; Board is the container only. A
container to read is a [Card](card.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `bare` | `false` | Keeps only its padding, for a slot with a surface |
| `flush` | `false` | No padding and no gap: the content holds its own |
| `children` | required | The parts of the picker |

## Contract

It fills the width of its container, with the panel surface and a strong
line, a level above the panel around it. pad-md inside; the content is a
Stack with gap md. Controls inside have a button's height.

With `flush` the padding goes and the surface and the line stay (with
`bare` too, only the padding goes). The content stacks with gap 0 and
reaches the edges, as in a [Panel](panel.md): lists, trees and a
[Disclosure](disclosure.md) go in directly, so their rows reach the line
of the board, while the head, a Segmented, a search, Glyphs and fields
go in a [Block](block.md).

## Example

[Board](../../examples/board/)
