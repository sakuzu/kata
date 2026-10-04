# Row

Row is the horizontal layout: items side by side, centred on one line.

## When to use

Use it for an icon and its text (gap 2xs), a group of controls (sm, the
default), groups of controls (lg) and borderless icon buttons (0, their
hit area is the space). Text shrinks and wraps inside the width it is
left, while icons, marks and controls keep their size. A row of controls
that may not fit takes `wrap`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `gap` | `sm` | `0`, `2xs`, `sm`, `md` or `lg` |
| `between` | `false` | Pushes the first and last items to the two ends |
| `wrap` | `false` | Moves items that do not fit to the next line |
| `align` | `center` | `first`, `start`, `end` or `stretch` |
| `justify` | `start` | `end` moves the whole run to the right end |
| `children` | required | The content |

## Contract

Row has no height, padding or line. Marks never shrink; in a row that
wraps no item shrinks, and items move to the next line whole. A caption or
paragraph at the end of a row takes the rest of the width. At the edge of
a container all the text in a row is trimmed to its ink, so that the items
of one line stay level.

A row that centres its items (the default `align`) centres them on their
ink. Its own height is what meets the edge, so at either edge its text is
trimmed on both sides, never on one: a text action beside a button sits on
the button's ink, wherever the row is in its container
([text and its ink](../measuring.md#text-and-its-ink)). With another
`align`, the text is trimmed on the side at the edge only.

`align="first"` aligns the items by their first baseline. A mark in a
[Markbox](markbox.md) then stays centred on the ink of the first line of
the text beside it, however many lines the text wraps to
([a mark beside text](../measuring.md#a-mark-beside-text)). Aligning the
tops (`start`) does not: the first line is trimmed at the edge and the
later ones are not, so the mark would rise by the half-leading.

```svelte
<Row gap="2xs" align="first">
  <Markbox><Icon name="check" /></Markbox>
  <Text>The history of every change to a map, kept for a year</Text>
</Row>
```

## Example

[Row](../../examples/row/)
