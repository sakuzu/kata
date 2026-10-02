# Tcard

Tcard is one row of a table folded into a card, for a narrow screen.

## When to use

Use it where a [Table](table.md) is too wide: one card for each row,
with the names of the columns and the values as pairs of `dt` and `dd`.
Controls do not go in a value; the row's actions go in `foot`. A card
that is pressed takes `role`, `tabindex` and `onclick`. Inside
[Tcards](tcards.md) it is placed at `y`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `sel` | `false` | Selected |
| `y` | | The distance from the top of Tcards, in px |
| `foot` | | The row's actions, at the bottom right |
| `children` | required | Pairs of `dt` and `dd` |

Other attributes (`role`, `tabindex`, `aria-*`, `data-*`) go to the
element.

## Contract

A line around it and pad-md inside. The names (6rem wide, muted) and
the values sit in two columns, gap-md apart, with gap-sm between the
rows; both are trimmed to their ink, and a name is level with the first
line of its value. An empty value still takes one line. Below 48rem the
columns fold into one: a name sits gap-xs above its value, and pad-sm
more lies above the next name. The actions are md under the values, at
the right, with a button's height. Selected is the raise surface and a
blue line of two at the left.

## Example

[Tcard](../../examples/tcard/)
