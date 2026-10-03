# Chip

Chip is a chosen value that can be removed, such as a filter.

## When to use

Use it for chosen values, one Chip each in a [Row](row.md); the ✕
removes one. With `onclick` the text can be pressed too, for example to edit the
value. A Chip without a remove button is a value that can be pressed. A
state or a kind is not a Chip: use [Badge](badge.md) or [Tag](tag.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `onremove` | | Removes the value; without it no ✕ shows |
| `onclick` | | Makes the text pressable |
| `removeLabel` | | The name of the ✕ (default: the `removeValue` message) |
| `children` | required | The value |

## Contract

A chip is a rectangle, since it can be pressed, with the height of a
small button (`--kata-height-button-sm`), a strong line and the raise
surface. pad-sm at both sides, and pad-2xs at the right when it has a
✕, which carries its own white space: a square of
`--kata-height-badge`, whose hit area and hover surface are that
square. The text is trimmed to its ink; a long value ends with an
ellipsis. Pressable text underlines on hover.

## Example

[Chip](../../examples/chip/)
