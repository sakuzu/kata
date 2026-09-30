# Chip

Chip is a chosen value that can be removed, such as a filter.

## When to use

Put the chosen values in a [Row](row.md), one Chip each; the ✕ removes
one. With `onclick` the text can be pressed too, for example to edit the
value. A value that cannot be removed, a state or a kind is not a Chip:
use [Badge](badge.md) or [Tag](tag.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `onremove` | | Removes the value; without it no ✕ shows |
| `onclick` | | Makes the text pressable |
| `removeLabel` | | The name of the ✕ (default: `removeValue`) |
| `children` | | The value |

## Contract

A chip is a rectangle, since it can be pressed, with the height of a
small button (`--kata-height-button-sm`), a strong line and the raise
surface. pad-sm at the left and pad-2xs at the right, where the ✕ is a
square of `--kata-height-badge`: its hit area and its hover surface are
that square. The text is trimmed to its ink; a long value ends with an
ellipsis. Pressable text underlines on hover.

## Example

[Chip](../../examples/chip/)
