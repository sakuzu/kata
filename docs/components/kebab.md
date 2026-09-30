# Kebab

Kebab is the menu of actions on an item of a list or a card.

## When to use

Put it at the right end of an item. It is also where a destructive
action on the item is reached, besides a context menu or the Delete key;
such an action never goes in a Footer.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `actions` | settings, share, copy, move, delete | The actions to offer |
| `onaction` | required | Called with the chosen action |

The actions are `settings`, `share`, `publish`, `copy`, `move`,
`ungroup` and `delete` (the type `KebabAction`).

## Contract

The trigger is a ghost icon button with an ellipsis, of the size its
container declares, named by the `actions` string. It opens a
[Dropdown](dropdown.md) menu at its right edge, with the keys of a menu.
The actions come in the fixed order above, whatever the order given,
each with its icon; `delete` comes last, after a divider, in red, with
an ellipsis after its name. Choosing an action closes the menu. The
names are the strings `settings`, `share`, `linkShare`, `duplicate`,
`move`, `ungroup` and `delete`.

## Example

[Kebab](../../examples/kebab/)
