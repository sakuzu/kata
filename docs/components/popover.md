# Popover

Popover is a small surface that opens next to its trigger.

## When to use

Use it for a few settings, a small picker or an explanation that belong
to one control. A list of actions is a menu ([Dropdown](dropdown.md)
with `menu`); a form or a choice that stops the work is a
[Modal](modal.md); one word is a [Tooltip](tooltip.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `anchor` | required | The trigger: a snippet of `(toggle, open)` |
| `align` | `start` | The edge of the trigger it lines up with |
| `gap` | `sm` | The distance between the children |
| `openInitially` | `false` | Open from the start |
| `children` | required | The content: a snippet of `(close)` |

## Contract

The surface is a [Bubble](bubble.md): the panel colour, a strong line,
the width of a popover and pad-md inside. It is placed as a
[Dropdown](dropdown.md) is: in the top layer, below the trigger (above
it when there is no room below), inside the window at the sides. A press
outside, Escape or Tab closes it.

## Example

[Popover](../../examples/popover/)
