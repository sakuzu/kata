# Drawbar

Drawbar is the bar of drawing tools that floats at the bottom centre of
the drawing area.

## When to use

Use it for the tools that change what a press on the drawing area does.
The application passes the tools as a list and says which one is
current; `onselect` reports the tool that is pressed. A tool that acts
at once (delete) is in the list too, with `tone: 'danger'`, and the
application leaves the current tool as it was.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tools` | required | The tools, `DrawbarTool[]` |
| `current` | | The id of the current tool |
| `onselect` | | Called with the id of the tool that is pressed |
| `label` | | The name of the bar |
| `bottom` | `md` | The distance from the bottom edge: `0` or a gap step |

A `DrawbarTool` is `{ id, label, icon, kbd?, group?, tone?, disabled? }`:
`icon` is an icon name or component, `kbd` the key that picks the tool,
shown in its tooltip, and `group` puts consecutive tools together.

## Contract

Each tool is a ghost icon button, pressed (`aria-pressed`) and on when it
is current, and shows its name and its key in a [Tooltip](tooltip.md);
a tool with `tone: 'danger'` turns red on hover. The tools of
a group sit gap-2xs apart and the groups gap-md apart, with pad-sm inside
and one strong line around the whole bar on the panel surface; no line
runs between tools. The bar is placed absolutely in its positioned
container, centred, `bottom` from its bottom edge, and never wider than
the container less gap-md on each side; when the tools do not fit it
scrolls sideways, and the tools never shrink.

## Example

[Drawbar](../../examples/drawbar/)
