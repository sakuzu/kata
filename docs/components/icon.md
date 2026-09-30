# Icon

Icon draws a line icon in the colour of the text around it.

## When to use

Use it beside text, in a button or at the start of a list item. `name`
takes a name from the icons list (`image`, and the drawing glyphs `point`,
`polyline`, `polygon`, `arrow` and `sticky-note`) or any icon component,
such as a Lucide icon. A button that shows only an icon needs an
`aria-label`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `name` | required | A name from `icons`, or an icon component |
| `tone` | | `blue`, `yellow`, `red`, `green` or `muted` |

## Contract

An icon is a square of `--kata-height-icon` (the root size) with a stroke
of 1.5, in `currentColor` unless a tone gives it the ink of a hue or the
muted color. It never shrinks and has no margin; flex layout centres it.
Its white space is never cancelled with a negative margin.

## Example

[Icon](../../examples/icon/)
