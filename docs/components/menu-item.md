# MenuItem

MenuItem is one action of a menu.

## When to use

Use it for each action of a [Menu](menu.md) or of a
[Dropdown](dropdown.md) with `menu`. A destructive action is `danger`,
comes last after a [MenuDivider](menu-divider.md), and its name ends
with an ellipsis when a confirmation follows. Items that choose one
value show the column of check marks with `checked`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `icon` | | An icon on the left (a name or a component) |
| `checked` | | The column of check marks; a mark when true |
| `kbd` | | A key hint at the right end |
| `sub` | `false` | The item opens a submenu: a chevron at the right end |
| `on` | `false` | Its submenu is open: it keeps the hover surface |
| `danger` | `false` | A destructive action: red text |
| `disabled` | `false` | Shown but not chosen: dimmed, no hover |
| `href` | | Renders a link |
| `onclick` | | Called when chosen |
| `children` | required | The name, or a Stack of two lines |

Other attributes (`data-*`, `aria-*`, `onmouseenter`) go to the element.

## Contract

It is a `<button>` (an `<a>` with `href`) with `role="menuitem"` and
`tabindex="-1"`; the menu moves the focus. It is at least as high as a
list item, with pad-md at the sides and gap-sm between the icon or the
check mark, the name and the key hint. The name is one line, trimmed to
its ink, with an ellipsis. A control or a Stack inside is pad-md from
the top and bottom edges, so the item grows with it. Hover shows the
raise surface up to the edges of the menu; the focus ring is drawn
inside.

## Example

[MenuItem](../../examples/menu-item/)
