# Menu

Menu is the surface of a list of actions.

## When to use

Use it for a menu the application places itself, such as a submenu
that opens to the right. A menu opened from a trigger is a
[Dropdown](dropdown.md) with `menu`, which wears this surface itself. To
choose a value, use a [Select](select.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `rows` | | The least height of the items: `mark`, `box`, `thumb`, `two` |
| `children` | required | The items, in an element with `role="menu"` |

## Contract

It has the panel color, a strong line and no padding, so the hover
surface of each [MenuItem](menu-item.md) reaches the edges and the
dividers. It is at least 12rem wide and never wider than the window less
gap-md on each side. An item is as high as its content plus pad-md above
and below; `rows` raises the least height of every item to that of a
list item with a mark, a control, a thumbnail or two lines, so that
items with different content line up. The roles and the keys belong to
the content.

## Example

[Menu](../../examples/menu/)
