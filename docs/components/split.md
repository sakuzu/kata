# Split

Split is a layout of two columns: a side column of fixed width and a main
column that takes the rest.

## When to use

Use it for navigation beside content, as in the settings of an
application or a modal with sections listed on the left. Columns of
equal weight are a [Grid](grid.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `width` | `14rem` | The width of the side column |
| `children` | required | The side column |
| `main` | required | The main column (a snippet) |

## Contract

Split has no gap, padding, surface or line; when the columns need a line
between them, one of them draws it. Below 48rem the side column moves
above the main one and both take the full width.

## Example

[Split](../../examples/split/)
