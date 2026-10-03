# ListItem

ListItem is one entry of a list: its columns hold a mark, a name and the
things at its end.

## When to use

Use it for each item of a [List](list.md); a line of a table is a row
of a [Table](table.md). An item that opens something takes `onclick`
(Enter and Space press it too, except in a field inside it) or `href`;
one that is only read takes `plain`, and then a `rule` under it, or a
surface, so that its edge can be seen. `sel` marks the selected item;
set `aria-selected` or `aria-current` on it as the list requires. When
the item ends with an icon button, `tail` lines the icon up with the
edge of the text.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `columns` | required | The columns (`grid-template-columns`) |
| `onclick` | | Makes the item pressable |
| `href` | | Renders a link |
| `plain` | `false` | Not pressed: no hover surface |
| `disabled` | `false` | With `onclick`: cannot be pressed now |
| `sel` | `false` | Selected |
| `rule` | `false` | A line under the item, except the last |
| `tail` | `false` | pad-sm at the right, for an icon button |
| `onkeydown` | | Called on a key; preventing it keeps the key |
| `children` | required | The content of the columns |

Other attributes (`aria-*`, `data-*`) go to the element.

## Contract

The height comes from the content. The least height is
`--kata-height-list-item`, the ink of the text and md above and below,
or the height the list declares with `rows`. Every visible thing in it,
a mark, a thumbnail, a control with a line or a surface and stacked
content, keeps md above and below, and the item grows to fit; an icon or
a markbox does not push. The columns are gap-sm apart; pad-md at the
sides, or the inset the container declares. Bare text is trimmed to its
ink and ends with an ellipsis. Controls inside are small buttons. Hover
shows the raise surface; selected is the raise surface and a blue line
of two at the left; the focus ring is drawn inside. Disabled, an item
pressed with `onclick` is the same shape without hue, as a disabled
[Button](button.md): dimmed, without hover, not pressed by a click or a
key, `aria-disabled="true"` and out of the tab order.

## Example

[ListItem](../../examples/list-item/)
