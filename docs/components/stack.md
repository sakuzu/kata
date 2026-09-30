# Stack

Stack is the vertical layout. It is the only container that holds the
distance between the things stacked in it, and it has no outline or
surface of its own.

## When to use

Use it for anything that runs from top to bottom. Choose the gap by the
relation between the children: 0 for a title and its caption, sm within
one group, md between different elements, lg between topics and xl between
the sections of a long page. The steps 2xs and xs belong inside
components. For side by side, use [Row](row.md); for columns,
[Grid](grid.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `gap` | required | `0`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl` or `2xl` |
| `align` | `stretch` | `start` keeps each child at its own width |
| `children` | required | The content |

## Contract

Stack has no height, padding or line. The gap is a `--kata-gap-*` step and
runs between the untrimmed line boxes of the children, so text in a stack
is apart by the gap plus its leading. Controls stacked directly are at
least md apart.

## Example

[Stack](../../examples/stack/)
