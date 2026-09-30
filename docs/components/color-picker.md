# ColorPicker

ColorPicker is a board to pick one color.

## When to use

Use it to choose a color for something drawn. In the flow of a page or
a panel, the board draws its own surface and line; inside a surface that
already draws them, such as a [Popover](popover.md), pass `bare`. A
small set of named colors alone is a [ColorGrid](color-grid.md). The
fields show the value as hex, RGB or HSL, starting with `format`. The
names of the parts come from the [messages](README.md#messages)
(`color`, `close`, `hue`, `saturation`, `lightness`, `saturationValue`,
`saturationValueText`, `eyedropper`, `colorCode`, and the names of the
default colors).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `#E5484D` | The chosen color as #RRGGBB (bindable) |
| `swatches` | nine colors | The preset colors, `{ name, hex }[]` |
| `format` | `hex` | The format the fields start in: `hex`, `rgb` or `hsl` |
| `bare` | `false` | Keeps only its padding, for a slot with a surface |
| `title` | the `color` message | The title |
| `onpick` | | Called with the color and its name (the hex without one) |
| `onclose` | | Called by the close button |

## Contract

The board is 15rem wide and never wider than its container, with pad-md
inside. It stacks, gap-sm apart, the title (h2) and a close button, a
[ColorGrid](color-grid.md), the plane of saturation and value, the strip
of hues with an eyedropper, and the fields with a [Select](select.md) of
the format. The plane and the strip follow the pointer and the arrow
keys; their knobs are the square of an icon with two edges, so they show
on any color. The eyedropper works where the browser has the EyeDropper
API. An invalid hex code is turned back to the current color.

## Example

[ColorPicker](../../examples/color-picker/)
