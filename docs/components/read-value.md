# ReadValue

ReadValue is a value that is read, not edited, in the place of a control.

## When to use

Use it in a [Field](field.md) or a [Pair](pair.md) on a screen that is
only viewed, or for a value that cannot be changed. Identifiers use
`mono`; a value that is not set is a muted sentence.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | required | The value |
| `mono` | `false` | The monospace font, with figures of equal width |
| `muted` | `false` | Not set, or left at the default |
| `clamp` | `false` | One line with an ellipsis |

## Contract

It has no outline: it is body text, and the Field or the Pair around it
holds the distances. Inside a control (a pair or a list item) it is
trimmed to its ink; elsewhere it keeps its line box, trimmed only on the
side that touches the edge of a container. With `clamp` the full text
shows on hover and on keyboard focus when it is clipped.

## Example

[ReadValue](../../examples/read-value/)
