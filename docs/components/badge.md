# Badge

Badge is the label of a state, next to the text it describes.

## When to use

Use it for a state that changes over time: public, link sharing, can
edit, expired. Give one meaning one hue across the application. What a
thing is (its kind) is a [Tag](tag.md); in one line, Tags come first. A
value that can be pressed or removed is a [Chip](chip.md). A badge never
wraps and is never pressed.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tone` | | `blue`, `green`, `yellow`, `red` or `faint` |
| `children` | | The word |

Without `tone` the badge is neutral. Other attributes (`aria-*`,
`data-*`) go to the element.

## Contract

The height is `--kata-height-badge`: the ink of a caption, pad-xs above
and below, and a line on each side. pad-sm at the sides; the text is a
caption trimmed to its ink. The corners are round, which tells a state
from a control. A hue is its fill with the text that reads on it and no
visible line; neutral is a strong line and text; faint is a weak line
and muted text, for a state that has ended. In a list item the badge
keeps md above and below, which makes the item as tall as
`--kata-height-list-item-mark`.

## Example

[Badge](../../examples/badge/)
