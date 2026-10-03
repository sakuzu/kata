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
| `end` | | A mark or a short value at the end of the first line (a snippet) |

## Contract

Text has no margin and keeps its full line box, so its distance to its
neighbours is the gap of a Stack or Row plus its leading. It is trimmed
to its ink in three places only: inside a component that declares its
height (and there it stays on one line), at the inner edge of a container,
and next to a line. A link made with `as="a"` keeps the color of the text
around it and is underlined on hover.

`end` puts a mark at the end of the text's first line: a
[Badge](badge.md) beside a title, a borderless icon button, or a short
value that must not shrink, such as a count in a caption. The text
and the end sit in one line, aligned by their first baseline, gap-sm
apart. The end is a seat of no height, so the mark is centred on the ink
of the first line and hangs without making the line taller
([a mark beside text](../measuring.md#a-mark-beside-text)). At the edge of
a container the mark hangs into the padding, and the line keeps the
height of its ink. The text wraps its own words and keeps at least
min(its own width, 4em) beside the end, four of its own characters, so a
short title keeps the end right after it. When the text cannot keep that
much, the end moves to a line of its own, gap-sm under the text, and
there its seat has the height of its mark: nothing is squeezed, the line
folds instead. Text on one line with an ellipsis (`clamp`, or text in a
control) keeps the end beside it and shrinks instead.

```svelte
<Text role="h2">Team plan{#snippet end()}<Badge>Current</Badge>{/snippet}</Text>
```

## Example

[Text](../../examples/text/)
