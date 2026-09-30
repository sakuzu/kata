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
| `align` | `center` | `start`, `end` or `stretch` |
| `justify` | `start` | `end` moves the whole run to the right end |
| `children` | | The content |

## Contract

Row has no height, padding or line. Marks never shrink; in a row that
wraps no item shrinks, and items move to the next line whole. A caption or
paragraph at the end of a row takes the rest of the width. At the edge of
a container all the text in a row is trimmed to its ink, so that the items
of one line stay level.

## Example

[Row](../../examples/row/)
