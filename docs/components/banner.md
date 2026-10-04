# Banner

Banner is a notice in the flow of a page or a panel.

## When to use

Use it for a notice that stays until its cause is gone: a warning, an
error, a state of the document. A remark without a line is a
[Note](note.md); a short message that goes by itself is a
[Toast](toast.md). The notices of a whole application go in
[Notices](notices.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tone` | required | `info`, `warn`, `error` or `ok` |
| `act` | | An action at the right end (a snippet) |
| `floating` | `false` | The panel surface, for a notice over the stage |
| `label` | | The accessible name, when it is referred to by name |
| `children` | | The text, one line that may wrap |
| `body` | | Several lines instead of the text (a snippet: a Stack of Texts) |

## Contract

Its line and its icon take the color of the tone (blue, yellow, red,
green); it has pad-md inside, the icon gap-sm from the text, centred on
the ink of the first line. The text is trimmed to its ink at the edges;
`body` holds several lines and only passes the edges on to them, so each
line is trimmed once. The action sits at the right end,
gap-sm from the text, on the baseline of its first line; when it does
not fit beside the text it moves below it, and shrinks to the container
with an ellipsis. Its role is
`alert` for an error and `status` otherwise.

## Example

[Banner](../../examples/banner/)
