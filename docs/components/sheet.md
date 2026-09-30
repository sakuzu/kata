# Sheet

Sheet is a panel that comes up from the bottom of a narrow screen.

## When to use

Use it for a panel that sits beside the stage on a wide screen, such as
the details of a selection, when the screen is too narrow. The user chooses
how much of the screen it takes.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `stage` | `half` | The height: `peek`, `half` or `full` (bindable) |
| `stages` | all three | The heights offered, lowest first |
| `onstage` | | Called when the height changes |
| `closable` | `false` | Below the lowest height, it closes |
| `onclose` | | Called when it closes |
| `pane` | `false` | The content is a panel with its own head |
| `label` | | The accessible name of the sheet |
| `name` | | Tells several sheets apart (`data-sheet`) |
| `z` | | The stacking order; the sheet layer by default |
| `head` | | The head, which does not shrink (a snippet) |
| `foot` | | The foot, for a primary action (a snippet) |
| `children` | required | The content, which scrolls |
| `inline` | `false` | In the flow, for documentation |

## Contract

It is placed absolutely at the bottom of its frame, which must be a
positioned element, with the panel surface and a strong line along its
top. The order inside is fixed: a handle gap-md high (a bar of two
lines), the head, the content and the foot; only the content shrinks and
scrolls, and it has no padding. `peek` is as high as the handle and the
head, `half` is half the frame and `full` all of it. A press on the
handle steps up through the heights and returns to the lowest; ArrowUp
and ArrowDown on the handle step up and down; a drag follows the pointer
and snaps to the nearest height on release. With `closable`, a drag well
below the lowest height, or ArrowDown there, closes it. The handle's
name is the `sheetHeight` message.

## Example

[Sheet](../../examples/sheet/)
