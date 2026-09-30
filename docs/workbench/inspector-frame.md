# InspectorFrame

InspectorFrame is the panel of the thing selected: its name, changed
where it stands, the tabs of its views and the sections that edit it.

## When to use

Use it for the panel that shows one selected thing and lets it be
changed, beside the drawing area. The application decides what the
thing is: it passes the name, the tabs and, as children, the
[InspectorSection](inspector-section.md) groups of the current tab,
filled with [InspectorRow](inspector-row.md) rows, a
[FieldList](field-list.md) or an [AttributeList](attribute-list.md).
When several things are selected, use
[SelectionSummary](selection-summary.md) instead.

Pass `ontitle` to let the name be changed. The frame shows `title`;
when a name is committed, `ontitle` receives it trimmed and the
application updates `title`, or the name goes back to it. So the
application decides what an empty name means: keep the old one, or put
a default in its place.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The name of the thing shown |
| `ontitle` | | Called with the name committed; without it, no editing |
| `titleEditable` | `true` | `false` shows the name as a title only |
| `placeholder` | `addName` message | The action shown while the name is empty |
| `subtitle` | | A second line under the name |
| `icon` | | An icon before the name |
| `tabs` | `[]` | The views, `{ id, label }[]` |
| `current` | the first tab | The id of the current tab (bindable) |
| `onselect` | | Called with the id of the tab that is opened |
| `head` | | Icon buttons in the head, before the close button (a snippet) |
| `end` | | The foot, a [Footer](../components/footer.md) with the actions (a snippet) |
| `onclose` | | Shows a close button in the head |
| `side` | `panel` | The width, as [Panel](../components/panel.md)'s `side` |
| `children` | required | The sections of the current tab |

## Contract

A [Panel](../components/panel.md) whose head is a
[Toolbar](../components/toolbar.md): the icon, the name, the controls of
`head` and the close button, in that order. The name is an
[InlineEdit](../components/inline-edit.md) at the size of h2 (Enter
commits, Escape restores) or, not editable, a title on one line with an
ellipsis. With a `subtitle`, the head grows to hold it as a muted
caption under the name. With `tabs`, a second Toolbar under the head
holds the [Tabs](../components/tabs.md), and its line is the one line
of the head; without, the head draws the line. The content is stacked
with gap 0 and scrolls; the foot keeps its height. The panel is a region
named by the name.

## Example

[InspectorFrame](../../examples/inspector-frame/)
