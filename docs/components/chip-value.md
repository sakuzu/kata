# ChipValue

ChipValue is a small surface attached to a point of the stage, which
holds a value: an input and the button that confirms it, or the value
alone.

## When to use

Use it to edit or read one value where it applies on the stage, such as
the length of a line being drawn. It is placed absolutely inside the
frame that holds the stage (a positioned element), at the point's
distance from the frame's edges. Collapsed, the chip only reads the value
and is itself the trigger that expands it: pass `onclick` and `label`.
With several values, `rows` stacks list items. A value edited in a panel
is a [NumberInput](number-input.md) in a [Field](field.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `top` | | The distance from the top: 0, a gap step or a length |
| `right` | | The distance from the right |
| `bottom` | | The distance from the bottom |
| `left` | | The distance from the left |
| `rows` | `false` | Stacks list items |
| `onclick` | | Makes the chip a button that expands it |
| `label` | | The name of that button |
| `children` | required | The input and the button, or the value |

## Contract

The surface is the panel with a strong line, over the stage
(`--kata-z-floating`). A gap step (`2xs` to `2xl`) is that step of the
gap scale, and any other string a CSS length. pad-sm inside and gap-sm
between its children, which sit in one row and keep their width. It
declares the small button for the controls inside, so the author writes
no size. As a trigger it shows the raise surface on hover.

## Example

[ChipValue](../../examples/chip-value/)
