# Note

Note is a remark without a line or a surface.

## When to use

Use it for one sentence that adds to what is around it. A notice with a
line is a [Banner](banner.md); the remark under an input is the note of
its [Field](field.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tone` | | `warn` (yellow) or `error` (red); muted without it |
| `icon` | | An icon before the text (a name or a component) |
| `clamp` | `false` | One line with an ellipsis |
| `children` | required | The text |

## Contract

It is text in the caption role, muted or in the colour of its tone. An
icon is gap-sm from the text and centred on the ink of the first line.
In a layout the text keeps its line box; inside a control, such as a
list item, it is trimmed to its ink. With `clamp` it is one line with an
ellipsis, and the full text shows on hover and on keyboard focus.

## Example

[Note](../../examples/note/)
