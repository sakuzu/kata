# Markbox

Markbox is the place of an icon: a square that centres a mark, so that
the first column of a list stays in place.

## When to use

Use it at the start of list items whose marks differ in size: icons,
color marks, a [Swatch](swatch.md) or an emoji (`glyph`). The font of
an emoji comes from `--kata-glyph-font`, set by the container.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `glyph` | `false` | The content is an emoji |
| `children` | required | The mark |

## Contract

A square of `--kata-height-icon` with no surface and no line, its
content centred. It does not change the height of a list item. An emoji
is not trimmed.

A Markbox is a seat: its baseline is that of a trimmed line centred in
it. Beside text that may wrap, it goes in a [Row](row.md) with
`align="first"`, and the mark is centred on the ink of the text's first
line ([a mark beside text](../measuring.md#a-mark-beside-text)).

## Example

[Markbox](../../examples/markbox/)
