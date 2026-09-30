# Icon

Icon draws a line icon in the color of the text around it.

## When to use

Use it beside text, in a button or at the start of a list item. `name`
takes a name from the [icons](#icons) or any icon component, such as a
Lucide icon. A button that shows only an icon needs an `aria-label`.

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

## Icons

`icons` holds the icons the components draw by name. Most come from
[Lucide](https://lucide.dev); the drawing glyphs are kata's own, drawn on
the same grid for the shapes Lucide does not have.

| Name | Drawn by |
| --- | --- |
| `arrow-left` | Lucide |
| `arrow-up-right` | Lucide |
| `check` | Lucide |
| `chevron-down` | Lucide |
| `chevron-left` | Lucide |
| `chevron-right` | Lucide |
| `circle-alert` | Lucide |
| `circle-check` | Lucide |
| `copy` | Lucide |
| `corner-up-right` | Lucide |
| `ellipsis` | Lucide |
| `funnel` | Lucide |
| `globe` | Lucide |
| `grip-vertical` | Lucide |
| `image` | Lucide |
| `info` | Lucide |
| `pencil` | Lucide |
| `pipette` | Lucide |
| `plus` | Lucide |
| `search` | Lucide |
| `settings-2` | Lucide |
| `share-2` | Lucide |
| `trash-2` | Lucide |
| `triangle-alert` | Lucide |
| `ungroup` | Lucide |
| `x` | Lucide |
| `eye` | Lucide |
| `eye-off` | Lucide |
| `lock` | Lucide |
| `lock-open` | Lucide |
| `undo-2` | Lucide |
| `point` | kata |
| `polyline` | kata |
| `polygon` | kata |
| `arrow` | kata |
| `sticky-note` | kata |

## Example

[Icon](../../examples/icon/)
