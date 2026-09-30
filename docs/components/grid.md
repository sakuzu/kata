# Grid

Grid is the layout in columns of equal width.

## When to use

Use it for cards, thumbnails and other items of the same kind that fill
the width in columns. Choose the number of columns at full width; the grid
folds them on its own as the page narrows. Things of different widths in
one line are a [Row](row.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `cols` | `2` | `2`, `3` or `4` columns at full width |
| `gap` | `md` | `sm`, `md` or `lg` |
| `children` | required | The cells |

## Contract

Grid has no height, padding or line. Its columns are `minmax(0, 1fr)`, so
the cells shrink instead of overflowing. Below 64rem three or four columns
become two, and below 48rem every grid has one column. The widths are
measured against the page's size container, in rem, so they follow the
text size setting.

## Example

[Grid](../../examples/grid/)
