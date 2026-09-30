# Floating

Floating is a container that floats over a drawing.

## When to use

Use it for what floats over a drawing: a search, the navigation, a
credit line, a small panel. It takes only its position from outside.
Without a position it stands in the flow of a place that is already
positioned, such as the content of a [Dropdown](dropdown.md) with
`bare`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `top` | | The distance to the top: a gap step, 0 or a length |
| `right` | | The distance to the right, likewise |
| `bottom` | | The distance to the bottom, likewise |
| `left` | | The distance to the left, likewise |
| `children` | required | The content |

## Contract

It has the panel colour and one strong line, no shadow, and floats on
the floating layer. It is placed absolutely in its frame, which must be
a positioned element; a step name (`2xs` to `xl`) is that gap step, and
any other string is a CSS length. With no side given it stands in the
flow and fills its place. It has no padding: list items hold their own,
and text goes in a [Block](block.md).

## Example

[Floating](../../examples/floating/)
