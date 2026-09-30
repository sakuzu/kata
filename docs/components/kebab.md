# Kebab

Kebab is the menu of actions on an item of a list or a card.

## When to use

Use it at the right end of an item. It is also where a destructive
action on the item is reached, besides a context menu or the Delete key;
such an action never goes in a Footer. The actions on several selected
items are a [Bulk](bulk.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `actions` | settings, share, copy, move, delete | The actions to offer |
| `onaction` | | Called with the chosen action |
| `items` | | A menu drawn from a model (`MenuModel[]`) instead of the actions |
| `onselect` | | Called with the id of the chosen item of `items` |

The actions are `settings`, `share`, `publish`, `copy`, `move`,
`ungroup` and `delete` (the type `KebabAction`).

## Contract

The trigger is a ghost icon button with an ellipsis, of the size its
container declares, named by the `actions` message. It opens a
[Dropdown](dropdown.md) menu at its right edge, with the keys of a menu.
The actions come in the fixed order above, whatever the order given,
each with its icon; `delete` comes last, after a divider, in red, with
an ellipsis after its name. Choosing an action closes the menu. The
names are the messages `settings`, `share`, `linkShare`, `duplicate`,
`move`, `ungroup` and `delete`. With `items`, the menu is a
[MenuList](../workbench/menu-list.md) of the model instead, with its
submenus, and the fixed actions do not show.

## Example

[Kebab](../../examples/kebab/)
