# Stats

Stats sets several [Stat](stat.md) side by side.

## When to use

Use it for a row of figures at the top of a page or a section. It holds
Stat only; a single figure is a Stat on its own.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | | The Stats |

## Contract

The stats are gap-lg apart. When they do not fit (a narrow container, a
large text size) they wrap, gap-sm between the lines. Like a
[Row](row.md), Stats passes the edge of its container to every Stat, so
that at the edge of a container with padding each one trims the line
that touches it: the figure at the top and the name at the bottom are
the padding from the edge
([text and its ink](../measuring.md#text-and-its-ink)).

## Example

[Stats](../../examples/stats/)
