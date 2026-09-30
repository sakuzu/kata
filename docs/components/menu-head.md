# MenuHead

MenuHead names a group of items in a menu.

## When to use

Use it above a group of [MenuItem](menu-item.md), such as the choices of
one setting. What is not a name, such as a name with an address, goes in
a [Block](block.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The name |

## Contract

It is an item that cannot be pressed: as high as a MenuItem, with pad-md
at the sides, and the name in the label role, trimmed to its ink,
centred, one line with an ellipsis. Its distance to a divider or an edge
is the same as an item's.

## Example

[MenuHead](../../examples/menu-head/)
