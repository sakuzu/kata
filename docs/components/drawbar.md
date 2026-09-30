# Drawbar

Drawbar is the bar of drawing tools that floats at the bottom centre of
the stage, with the switches of the aids after the tools.

## When to use

Use it for the tools that change what a press on the stage does.
The application passes the tools as a list and says which one is
current; `onselect` reports the tool that is pressed. A tool that acts
at once (delete) is in the list too, with `tone: 'danger'`, and the
application leaves the current tool as it was. Aids that are on or off
while any tool is in use, such as snapping or a grid, go in `toggles`;
each reports the state it asks for, and the application keeps it. The
actions of a panel go in its [Toolbar](toolbar.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tools` | required | The tools, `DrawbarTool[]` |
| `toggles` | `[]` | The switches after the tools, `DrawbarToggle[]` |
| `current` | | The id of the current tool |
| `onselect` | | Called with the id of the tool that is pressed |
| `label` | | The name of the bar |
| `bottom` | `md` | The distance from the bottom edge: `0` or a gap step |

A `DrawbarTool` is `{ id, label, icon, kbd?, group?, tone?, disabled? }`:
`icon` is an icon name or component, `kbd` the key that picks the tool,
shown in its tooltip, and `group` puts consecutive tools together.

A `DrawbarToggle` is `{ id, label, icon, on, onchange, kbd?, disabled? }`:
`on` is its state and `onchange` is called with the state it asks for.

## Contract

Each tool is a ghost icon button, pressed (`aria-pressed`) and on when it
is current, and shows its name and its key in a [Tooltip](tooltip.md);
a tool with `tone: 'danger'` turns red on hover. The switches are the
same buttons in one more group after the tools, pressed and on while
they are on. The tools of a group sit gap-2xs apart and the groups
gap-md apart, with pad-sm inside and one strong line around the whole
bar on the panel surface; no line runs between tools. The bar is placed
absolutely in its positioned container, centred, `bottom` from its
bottom edge, and never wider than the container less gap-md on each
side. When the buttons do not fit, those that do not fit fold into a
More menu, an icon button in a group of its own at the right end: the
current tool always shows, then the others from the start as long as
they fit. In the menu a tool shows its icon and a switch a check mark
when it is on, each with its key. The widths are measured again when the
container or the text size changes; the buttons never shrink.

## Example

[Drawbar](../../examples/drawbar/)
