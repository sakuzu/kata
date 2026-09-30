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
| `children` | required | The parts of the picker |

## Contract

It fills the width of its container, with the panel surface and a strong
line, a level above the panel around it. pad-md inside; the content is a
Stack with gap md. Controls inside have a button's height.

## Example

[Board](../../examples/board/)
