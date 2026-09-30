# Tcards

Tcards is a column of [Tcard](tcard.md) that fills its container and
scrolls itself.

## When to use

Use it as the narrow form of a table that fills its container. For a
virtual scroll, pass the height of the whole column (the number of rows
times the height of one card, measured on a rendered card) as `height`,
and render only the cards in view, each at its `y`. A few cards that do
not scroll are Tcard in a [Stack](stack.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `height` | | The height of the whole column; without it the content's |
| `el` | | The element that scrolls (bindable) |
| `onscroll` | | Called when it scrolls |
| `children` | required | The Tcards in view |

## Contract

It fills the height of its container and scrolls vertically, with no
padding. The cards are placed absolutely on a column of the given
height, at their `y`.

## Example

[Tcards](../../examples/tcards/)
