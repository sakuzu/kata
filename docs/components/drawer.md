# Drawer

Drawer is a panel that slides in from the left over a narrow screen.

## When to use

Use it for the navigation or the list that sits in a rail on a wide
screen, when the screen is too narrow to show the rail. Its content is
the rail's content: list items, and text in a [Block](block.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether it is open (bindable) |
| `label` | | The accessible name of the drawer |
| `onclose` | | Called when the scrim or Escape closes it |
| `children` | | The content |
| `inline` | `false` | The same surface in the flow, for documentation |

## Contract

It is placed absolutely at the left of its frame, which must be a
positioned element, over its full height. Its width is
`--kata-width-drawer`, never wider than the frame; it has the panel
surface, a strong line on its right and no padding, and it scrolls when
its content is taller. A scrim covers the rest of the frame; a press on
the scrim or Escape closes the drawer. Both are on the sheet layer. The
scrim's name is the `close` string.

## Example

[Drawer](../../examples/drawer/)
