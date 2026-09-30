# Text

Text is text in one of the nine type roles of the [tokens](../tokens.md).

## When to use

Use it for every piece of interface text outside a control: titles,
paragraphs, captions, labels, values. The role sets the size, leading,
tracking, weight and element: `title` and `h1` are an h1, `h2` an h2,
`body` and `prose` a p, and the rest a span shown as a block. Long
text written as HTML goes in a [Prose](prose.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `role` | `body` | One of the nine type roles |
| `as` | | Another element (`a`, `label`, `dt`, `dd` …) |
| `clamp` | `false` | One line and an ellipsis; the full text on hover |
| `lines` | | `2`: two lines and an ellipsis |
| `wrap` | `false` | Keeps line breaks and wraps long words |
| `muted` | `false` | The muted text color |
| `mono` | `false` | The monospace font, at the role's size |
| `tabular` | `false` | Figures of equal width |
| `href` | | The target, with `as="a"` |
| `for` | | The labelled control, with `as="label"` |
| `id` | | The element's id |
| `children` | | The text |

## Contract

Text has no margin and keeps its full line box, so its distance to its
neighbours is the gap of a Stack or Row plus its leading. It is trimmed
to its ink in three places only: inside a component that declares its
height (and there it stays on one line), at the inner edge of a container,
and next to a line. A link made with `as="a"` keeps the color of the text
around it and is underlined on hover.

## Example

[Text](../../examples/text/)
