# Page

Page is the body of a page: its margin, its head and its content.

## When to use

Use it once per page, with a [PageHeader](page-header.md) as the head.
Actions start the content; they do not go in the head. Use
`width="settings"` for pages to read or configure, and `flush` when the
content starts with a list, a tree, a table or tabs.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `width` | `full` | `settings` limits the column to the settings width |
| `flush` | `false` | The content starts with a list, tree, table or tabs |
| `head` | | The head, a PageHeader (a snippet) |
| `children` | | The content |

## Contract

The margin is gap-lg (gap-md at the sides below 48rem). From the bottom of
the head to the first visible thing of the content (the ink of text or the
outline of a control) the distance is always pad-lg; with `flush` the
first item's padding is part of it. The content is stacked gap-lg apart.
With `settings` the column is at most `--kata-width-settings` wide.

## Example

[Page](../../examples/page/)
