# Board

Board is the container of a picker that opens inside a panel, such as a
picker of colours or symbols.

## When to use

Place the parts of the picker in order: a search, a
[Segmented](segmented.md), [Glyphs](glyphs.md). The bars of a picker
(hue, lightness) are the picker's own; Board is the container only. A
container to read is a [Card](card.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The parts of the picker |

## Contract

It fills the width of its container, with the panel surface and a strong
line, a level above the panel around it. pad-md inside; the content is a
Stack with gap md. Controls inside have a button's height.

## Example

[Board](../../examples/board/)
