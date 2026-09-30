# MenuList

MenuList draws a menu from its model: the items, the dividers, the
headings and the submenus, described as data.

## When to use

Use it wherever a menu is described once and shown in more than one
place: in a [Dropdown](../components/dropdown.md) with `menu`, in a
[Menu](../components/menu.md) inside an element with `role="menu"`, or
through the parts and components that take the same model:
[AppMenu](app-menu.md), [MenuSheet](menu-sheet.md),
[Kebab](../components/kebab.md) (`items`),
[Topbar](../components/topbar.md) (`menu`) and
[LayerTree](layer-tree.md) (`addMenu`). For a few fixed actions, write
[MenuItem](../components/menu-item.md)s directly.

## The model

A menu is an array of `MenuModel`, each entry one of three shapes.

```ts
import type { MenuModel } from '@sakuzu/kata/svelte';

const menu: MenuModel[] = [
  { id: 'new', label: 'New drawing', kbd: '⌘N' },
  { id: 'export', label: 'Export', items: [{ id: 'png', label: 'PNG' }] },
  { divider: true },
  { heading: 'Show' },
  { id: 'grid', label: 'Grid', checked: true },
];
```

| Field | Description |
| --- | --- |
| `id` | Reported when the item is chosen |
| `label` | The name of the item |
| `kbd` | A key hint at the right end |
| `icon` | An icon on the left (a name or a component) |
| `disabled` | Shown but not chosen |
| `checked` | A check mark; the items of its level keep the column of marks |
| `danger` | A destructive action: red text |
| `href` | A link: the item goes there instead of reporting its id |
| `items` | The entries of a submenu |

`{ divider: true }` is a [MenuDivider](../components/menu-divider.md) and
`{ heading }` a [MenuHead](../components/menu-head.md). `isMenuItem`
tells an item from the other two.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The model, `MenuModel[]` |
| `onselect` | | Called with the id of the chosen item (not for a link) |
| `onclose` | | Called after an item was chosen, to close the menu |
| `inline` | `false` | Submenus take the place of the list at every width |

`level`, `backLabel` and `onexit` are set by MenuList on its own
submenus; the application leaves them out.

## Contract

Each entry is a MenuItem, a MenuDivider or a MenuHead, so the menu has
their heights and their distances. An item with `items` shows the
chevron of a submenu; hovering or pressing it opens the submenu next to
its row, in a Menu of its own that is fixed to the window, opens on the
left when there is no room on the right and moves up inside the window.
Below the narrow width (48rem), and always with `inline`, the submenu
takes the place of the list instead, under a row with an arrow and the
name of the submenu that goes back. The up and down arrows, Home and End
move the focus between the items of the level shown and wrap at the
ends; the right arrow opens a submenu and moves into it, the left arrow
goes back to its row. Choosing an item reports its id and calls
`onclose`; a disabled item does nothing.

## Example

[MenuList](../../examples/menu-list/)
