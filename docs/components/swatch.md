# Swatch

Swatch shows a sample of a colour.

## When to use

Use it beside a name in a list, a legend or the trigger of a colour. The
shape tells the kind of thing drawn: `box` a filled square, `dot` a
point, `line` a segment, `area` a small square with a line, `ramp` a
continuous scheme (pass a gradient as `color`) and `icon` a tool's glyph
in the colour. A swatch that is pressed goes inside an icon
[Button](button.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `color` | required | A CSS colour, or a gradient for `ramp` |
| `shape` | `box` | `box`, `dot`, `line`, `area`, `ramp` or `icon` |
| `icon` | | The glyph for `icon` (a name or a component) |
| `fill` | `false` | Stretches to the width of its container |

## Contract

The box is the square of an icon with a line inside, so that a pale
colour keeps its edge without growing the mark; the other shapes have
fixed sizes in rem. The glyph of `icon` is drawn over a halo of the same
glyph, thicker, in line-strong. The colour is a value of the content and
is the one style a component takes (`--kata-swatch-color`). A swatch is
hidden from screen readers; the text beside it names it.

## Example

[Swatch](../../examples/swatch/)
