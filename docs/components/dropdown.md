# Dropdown

Dropdown is the place that opens below a trigger, for a menu or a small
picker.

## When to use

Use it for the menu of a trigger, with `menu` and a list of
[MenuItem](menu-item.md), or for a small picker, with `bare` and content
that brings its own container, such as a
[ColorPicker](color-picker.md). A few settings are
a [Popover](popover.md), which is built on it; the actions of an item
are a [Kebab](kebab.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `trigger` | required | The trigger: a snippet of `(toggle, open)` |
| `panel` | required | The content: a snippet of `(close)` |
| `menu` | `false` | The content is a list of MenuItem |
| `bare` | `false` | The content has its own container |
| `align` | `end` | The edge of the trigger it lines up with |
| `up` | `false` | Opens above the trigger, below only without room |
| `openInitially` | `false` | Open from the start |
| `menuMaxWidth` | | The greatest width, a CSS length |
| `block` | `false` | The trigger is as wide as its container |
| `role` | `anchor` | `box` for a control, `icon-button` for an icon button |
| `onOpenChange` | | Called whenever it opens or closes |

## Contract

The place is a popover in the top layer, so a modal or a panel around
the trigger does not hide it. It opens 4px below the trigger, lined up
with its `align` edge, or above it when there is less room below than
its height (or 120px); it stays 8px inside the window. With `up` the
two sides change places: it opens above the trigger, and below it when
there is less room above than its height (or 120px) and more below.
A trigger inside a bar (an element with `role="toolbar"` or
`data-role="toolbar"`: a Toolbar, a Topbar or a Drawbar) opens it from
the bar's edge instead of its own, still lined up with the trigger at
the sides. From a vertical bar (`aria-orientation="vertical"`, a Drawbar
standing in a column) it opens beside the bar, 4px from its left edge, or
from its right edge when there is no room on the left, lined up with the
top of the trigger; `up` does not apply there. With `menu`, it has the
surface of a [Menu](menu.md) and `role="menu"`, the first item takes the
focus, the arrow keys move the focus between the items and wrap at the
ends, and Home and End go to the first and the last. A press outside,
Escape or Tab closes it; Escape and Tab return the focus to the trigger
of a menu. Escape goes no further, so a modal around it stays open.
Each time it opens or closes, the wrapper of the trigger dispatches a
bubbling `kata-menu-toggle` event with `detail: { open }`, so the element
around the trigger (a [TreeRow](tree-row.md)) knows a menu of its own is
open.

## Example

[Dropdown](../../examples/dropdown/)
