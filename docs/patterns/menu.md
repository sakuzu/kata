# A menu

A menu is a list of actions that opens from a trigger and closes when
one is chosen. In kata a menu is described once, as data
(`MenuModel[]`), and drawn wherever it opens.

## When to use

Use a menu for actions that do not need to be seen all the time: the
actions of an item, a group of commands in a bar, the menu of the
application. Two or three actions that are used often are buttons
instead; a choice of one value is a [Select](../components/select.md) or
a [Segmented](../components/segmented.md) control.

## Parts

- The model, `MenuModel[]`: items with an `id`, a `label` and an
  optional `icon`, `kbd`, `checked`, `danger` or submenu `items`, with
  `{ divider: true }` and `{ heading }` between them
  ([MenuList](../workbench/menu-list.md) describes it).
- A button that opens it: a [Dropdown](../components/dropdown.md) with
  `menu` and a [MenuList](../workbench/menu-list.md) inside.
- The actions of an item: a [Kebab](../components/kebab.md) at the end
  of the item, with `items`.
- The menu of the application: `menu` on the
  [Topbar](../components/topbar.md), or an
  [AppMenu](../workbench/app-menu.md) behind one button. On a phone the
  same model goes in a [MenuSheet](../workbench/menu-sheet.md).

## Rules

- Order the items by use, group them with dividers, and put a
  destructive item last, with `danger` and an ellipsis when it asks
  before it acts.
- A key hint shows the shortcut that does the same thing; the shortcut
  itself is attached by the [Shell](../workbench/shell.md).
- A submenu opens next to its item; below 48rem it takes the place of
  the list. Keep menus one level deep where you can.

## Example

[A menu](../../examples/pattern-menu/)
