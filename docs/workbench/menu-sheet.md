# MenuSheet

MenuSheet shows a menu in a sheet that comes up from the bottom of a
narrow screen.

## When to use

Use it on a phone for the same model that an [AppMenu](app-menu.md)
shows on a wider screen, so that the application describes its menu
once. It is placed in the frame of the application, which must be a
positioned element, as for a [Sheet](../components/sheet.md). The
application opens it with `open`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The model, `MenuModel[]` |
| `onselect` | | Called with the id of the chosen item |
| `open` | `false` | The sheet shows (bindable) |
| `onclose` | | Called when the sheet closes |
| `title` | "Menu" | The title in the head of the sheet |

## Contract

It is a Sheet at half or full height, with a
[Toolbar](../components/toolbar.md) head that holds the title, and the
model as a [MenuList](menu-list.md) with `inline`: a submenu takes the
place of the list, under a row that goes back. The first item takes the
focus when it opens, and the keys are a MenuList's. Choosing an item
reports its id and closes the sheet; a drag below the lowest height and
Escape close it too.

## Example

[MenuSheet](../../examples/menu-sheet/)
