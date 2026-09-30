# Pin

Pin is a mark that stands on a point of a canvas: the people of a
comment, or a point being placed.

## When to use

Place it absolutely at the point, which is its top left corner; the pin
hangs down and to the right and never moves. By default it holds small
[Avatars](avatar.md) and `more` for the rest; `solid` is a point being
placed, with one icon. With `onclick` it is a button and needs a
`label`; `active` shows that what it opens is open.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | | The name of the pin |
| `onclick` | | Makes the pin a button |
| `solid` | `false` | A point being placed: filled, with one icon |
| `active` | `false` | Selected: filled |
| `more` | | The count of the others, such as `+2` |
| `children` | required | Small avatars, or an icon |

## Contract

A capsule with a square top left corner, the panel surface and a strong
line, no shadow; pad-2xs inside. Small avatars overlap by gap-xs; `more`
is a glyph on raise-2, as tall as a badge. `active` fills it with the
solid colour; `solid` is a filled square of an icon button with its icon
centred. As a button it has `aria-pressed`.

## Example

[Pin](../../examples/pin/)
