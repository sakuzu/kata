# Modal

Modal is a container laid over the screen for one task.

## When to use

Use it when a task stops the work: a form to fill in, a choice to make.
A question before an action is a [Confirm](confirm.md); a few settings
next to their trigger are a [Popover](popover.md); something to look at
while working is a panel or a [Drawer](drawer.md). A modal has one
primary action, a title that says what it does, and two ways to close:
Escape and the close button. A modal does not open another modal.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether it is open (bindable) |
| `title` | required | The title in the head |
| `size` | `md` | The width: `sm`, `md`, `lg` or `xl` |
| `confirm` | `false` | A confirmation: small, centred, the scrim ignored |
| `persistent` | `false` | No close button; Escape and the scrim do nothing |
| `flush` | `false` | The body has no padding; the content holds its own |
| `status` | | A status at the left end of the Footer |
| `onclose` | | Called once when it closes, however it closes |
| `onback` | | On a full screen, the head starts with back instead |
| `children` | | The body |
| `sub` | | A band under the head, for steps (a snippet) |
| `lead` | | The left end of the Footer (a snippet) |
| `secondary` | | A secondary action (a snippet) |
| `cancel` | | The cancel button (a snippet) |
| `primary` | | The primary button (a snippet) |
| `inline` | `false` | The same surface in the flow, for documentation |

## Contract

A modal is a `<dialog>` opened with `showModal()`: the page behind is
inert, the focus stays inside and a scrim covers the rest. From top to
bottom it holds the head (as high as a toolbar, an h2 title on one line
and a close button, a line below), the band for steps, the body and the
[Footer](footer.md), which orders the actions. Only the body shrinks and
scrolls. The body has pad-md inside and its children are gap-md apart.
The width is 25, 35, 45 or 60rem and the modal is at least gap-lg from
the edges of the screen. It opens with the focus on the first input of
the body, else on the primary action. Escape, the close button and a
press on the scrim close it (a confirmation ignores the scrim, a
persistent modal ignores all three). Below 48rem it fills the screen:
the close button (or back) starts the head, the primary action ends it,
and the other actions move to the end of the body. Its strings are
`close` and `back`.

## Example

[Modal](../../examples/modal/)
