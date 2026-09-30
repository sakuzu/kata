# Counter

Counter shows a count on the solid surface, such as a number of unread
items.

## When to use

Use it on an icon button (through Button's `badge`) or beside a name.
The application rounds 100 and more to "99+". A word that tells a state
is a [Badge](badge.md), and one that tells a kind a [Tag](tag.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The count |

## Contract

Its height and its least width are the square of an icon
(`--kata-height-icon`); with more digits it grows sideways, with pad-2xs
at the sides. The number is in the glyph role, with figures of equal
width, trimmed to its ink and centred. A ring two lines wide, in the
panel color, separates it from an icon it overlaps.

## Example

[Counter](../../examples/counter/)
