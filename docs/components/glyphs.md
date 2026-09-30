# Glyphs

Glyphs is a grid of symbols or emoji to pick one from.

## When to use

Use it in a picker, inside a panel or a popover. With `row` the symbols
run in one line instead, for a toolbar. When the same symbol appears
twice, pass `selected` to tell them apart by position. A choice of
colors is a [ColorGrid](color-grid.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The symbols, one per cell |
| `value` | | The selected symbol |
| `onselect` | required | Called with the symbol and its position |
| `label` | | `(symbol, i)` to the name of a cell (default: the symbol) |
| `selected` | | `(symbol, i)` to whether a cell is selected |
| `row` | `false` | One line that scrolls sideways |

## Contract

Eight columns fill the width, gap-2xs apart; a cell is as tall as a button
and its symbol takes the size of the h1 role. A cell has the raise surface
on hover; the selected cell has `--kata-color-raise-2` and a line of
`--kata-color-blue-ink` inside, and reports `aria-pressed`. The focus ring
is drawn inside. The font of the symbols is `--kata-glyph-font`, set by the
container (an emoji font, for example).

## Example

[Glyphs](../../examples/glyphs/)
