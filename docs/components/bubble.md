# Bubble

Bubble is the surface of a popover, without a trigger.

## When to use

Use it where the application places the surface itself, such as a card
pinned to a point of the stage or a conversation. A surface that opens
from a trigger is a [Popover](popover.md), which wears a Bubble.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `gap` | `sm` | The distance between the children: `0`, `sm`, `md`, `lg` |
| `flush` | `false` | No padding and no gap: the content holds its own |
| `foot` | | A part below the content that stays in view (a snippet) |
| `children` | required | The content |

## Contract

It has the panel color, a strong line and the width of a popover
(`--kata-width-popover`), never wider than the window less gap-md on
each side. The content has pad-md inside and is a Stack. With `foot`,
the foot has pad-md inside and a line above it; the content scrolls and
the foot stays in view within the height its place allows.

## Example

[Bubble](../../examples/bubble/)
