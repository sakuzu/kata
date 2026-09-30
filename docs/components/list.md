# List

List is a column of [ListItems](list-item.md) and nothing else.

## When to use

Use it for items of one kind: documents, people, notifications. Put it
where it reaches the edges of its container (a panel, a page), not in a
container with padding. A switch, a checkbox or a radio is not a list
item and goes in a [Stack](stack.md); values in columns are a
[Table](table.md). When the items hold different things and must line
up, `rows` raises their least height.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | | The name of the list |
| `role` | `list` | `group` for a list of choices (with `label`) |
| `rows` | | The least item height: `mark`, `box`, `thumb` or `two` |
| `children` | required | The ListItems |

## Contract

The items touch: the list has no padding and no gap, and its outline
runs from the top of the first item to the bottom of the last; the
distance to its neighbours is the gap of the layout around it. `rows`
makes every item at least as tall as one that holds a mark
(`--kata-height-list-item-mark`), a small button
(`--kata-height-list-item-lg`), a thumbnail
(`--kata-height-thumbnail-row`) or two lines
(`--kata-height-list-item-two`). With a `label` the list has its role
and name.

## Example

[List](../../examples/list/)
