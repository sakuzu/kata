# ColorPicker

ColorPicker is a board to pick one colour.

## When to use

Use it to choose a colour for something drawn. In the content, the board
draws its own surface and line; in a floating slot that draws them, pass
`bare`. The fields show the value as hex, RGB or HSL, starting with
`format`. The names of the parts come from the [strings](README.md#strings)
(`color`, `close`, `hue`, `saturation`, `lightness`, `saturationValue`,
`saturationValueText`, `eyedropper`, `colorCode`, and the names of the
default colours).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `#E5484D` | The chosen colour as #RRGGBB (bindable) |
| `swatches` | nine colours | The preset colours, `{ name, hex }[]` |
| `format` | `hex` | The format the fields start in: `hex`, `rgb` or `hsl` |
| `bare` | `false` | Keeps only its padding, for a slot with a surface |
| `title` | Color | The title |
| `onpick` | | Called with the colour and its name (the hex without one) |
| `onclose` | | Called by the close button |

## Contract

The board is 15rem wide and never wider than its container, with pad-md
inside. It stacks, gap-sm apart, the title (h2) and a close button, a
[ColorGrid](color-grid.md), the plane of saturation and value, the strip
of hues with an eyedropper, and the fields with a [Select](select.md) of
the format. The plane and the strip follow the pointer and the arrow
keys; their knobs are the square of an icon with two edges, so they show
on any colour. The eyedropper works where the browser has the EyeDropper
API. An invalid hex code is turned back to the current colour.

## Example

[ColorPicker](../../examples/color-picker/)
