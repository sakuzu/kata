# Confirm

Confirm is a modal that asks before an action.

## When to use

Use it before an action that removes something or cannot be undone, and
before one whose effect reaches other people. The title is the question
("Delete 4 items?") and the message says what happens. A destructive
action is `danger`; its button is the one red fill a Footer may hold.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether it is open (bindable) |
| `title` | required | The question |
| `message` | | One paragraph of body |
| `children` | | A body in place of the message |
| `confirmLabel` | the `confirm` string | The name of the action |
| `cancelLabel` | the `cancel` string | The name of cancel |
| `danger` | `false` | A destructive action: the button is `danger-fill` |
| `busy` | `false` | The action is running: its button is dimmed |
| `disabled` | `false` | The action cannot run yet |
| `onconfirm` | required | Called when the action is confirmed |
| `oncancel` | | Called once when it closes without confirming |
| `inline` | `false` | The same surface in the flow, for documentation |

## Contract

It is a small [Modal](modal.md) (25rem) in the centre of every screen,
gap-md from its edges, with the role `alertdialog`. The Footer holds
cancel, then the action as `primary` or `danger-fill`. It opens with the
focus on cancel, so Enter does not confirm by accident. Escape and the
close button close it and call `oncancel`; a press on the scrim does
nothing. Confirming calls `onconfirm` and leaves it open: the caller
shows `busy` while the work runs and sets `open` to false when it is
done.

## Example

[Confirm](../../examples/confirm/)
