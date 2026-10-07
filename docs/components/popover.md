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
| `up` | `false` | Opens above the trigger, below only without room |
| `gap` | `sm` | `0`, `sm`, `md` or `lg` between the children |
| `flush` | `false` | No padding and no gap: the content holds its own |
| `openInitially` | `false` | Open from the start |
| `children` | required | The content: a snippet of `(close)` |

## Contract

The surface is a [Bubble](bubble.md): the panel color, a strong line,
the width of a popover and pad-md inside. It is placed as a
[Dropdown](dropdown.md) is: in the top layer, gap-xs below the trigger
(above it when there is no room below; with `up`, above it, and below
only when there is no room above), gap-md inside the window at the
sides, and it follows the trigger while it is open. A press outside,
Escape or Tab closes it.

With `flush` the surface has no padding: the content reaches the edges
and stacks with gap 0, as in a [Panel](panel.md). Lists, trees and
section headers go in directly; text and fields go in a
[Block](block.md). `gap` is not used with `flush`.

## Example

[Popover](../../examples/popover/)
