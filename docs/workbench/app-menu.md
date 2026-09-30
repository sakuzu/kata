# AppMenu

AppMenu is the menu of an application behind one button: File, Edit,
View and the rest, each a submenu.

## When to use

Use it for the commands of the whole application, once per screen. The
menu is a model, `MenuModel[]` (see [MenuList](menu-list.md)); its
entries at the root are mostly submenus, and a few actions that are
used often. The same model is the menu of the brand of a
[Topbar](../components/topbar.md) (`menu`) and, on a narrow screen, a
[MenuSheet](menu-sheet.md). The actions of one item belong in a
[Kebab](../components/kebab.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The model, `MenuModel[]` |
| `onselect` | | Called with the id of the chosen item |
| `label` | "Menu" | The text of the trigger, or its name with `icon` |
| `icon` | | An icon button instead of a text button |
| `align` | `start` | The edge of the trigger the menu lines up with |
| `onOpenChange` | | Called whenever the menu opens or closes |

## Contract

The trigger is a [Button](../components/button.md) with the label and a
chevron, or with `icon` a ghost icon button named by the label. It opens
a [Dropdown](../components/dropdown.md) menu that holds a MenuList of the
model, so the keys, the submenus and the narrow width behave as a
MenuList's do. Choosing an item reports its id and closes the menu. The
name of the trigger is the string `menu` when no label is given.

## Example

[AppMenu](../../examples/app-menu/)
