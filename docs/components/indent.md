# Indent

Indent moves the content that belongs to an open item to the right, so
that it lines up with the item's name rather than its disclosure button.

## When to use

Use it under an expanded list item for the content it reveals: a Block, or
a list of child items. Its children reach the edges.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The content |

## Contract

The space on the left is an empty column as wide as an icon button
(`--kata-height-icon-button`), followed by the gap-sm of the grid; there
is no padding. The right edge stays where the item's is.

## Example

[Indent](../../examples/indent/)
