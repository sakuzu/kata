# Toast

Toast is a short message in a corner of the screen.

## When to use

Use it to confirm what just happened, or to report a failure that needs
no answer. Most toasts come from the toast store through a
[ToastHost](toast-host.md); a Toast placed by hand takes any of the four
tones and one action, such as undo. A notice that stays until its cause
is gone is a [Banner](banner.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tone` | `info` | `info`, `warn`, `error` or `ok` |
| `act` | | One action at the right end (a snippet) |
| `children` | required | The message |

## Contract

It has the panel color, a strong line (red for an error), pad-md
inside and the width of a toast (`--kata-width-toast`), never wider
than its place. The icon takes the color of the tone and sits in a
seat, centred on the ink of the first line of the text however it
wraps ([a mark beside text](../measuring.md#a-mark-beside-text)); the
icon, the
text and the action are gap-sm apart, and the action is a small button
at the right end that moves below the text when it does not fit. Its
role is `alert` for an error and `status` otherwise.

## Example

[Toast](../../examples/toast/)
