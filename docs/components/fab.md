# Fab

Fab is the main action of a small screen, floating over the drawing
area.

## When to use

Use it on a narrow screen, where the toolbars do not show the main
action, once per screen. Do not show it while a modal is open: the
modal's primary action is the filled one then.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name of the action |
| `icon` | required | An icon name or an icon component |
| `onclick` | | Called when pressed |
| `disabled` | `false` | Dimmed and not pressable |
| `top` | | The distance from the top edge: `0` or a gap step |
| `right` | `md` | The distance from the right edge |
| `bottom` | `md` | The distance from the bottom edge |
| `left` | | The distance from the left edge |

## Contract

A square as tall as a button, with square corners, the solid fill and a
strong line, and its icon in the colour on the fill; hover and press
darken the fill one step each. It is placed absolutely in its positioned
container; `top` frees the bottom and `left` frees the right. Disabled,
it is dimmed.

## Example

[Fab](../../examples/fab/)
