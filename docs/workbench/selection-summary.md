# SelectionSummary

SelectionSummary is the panel of a selection of several things: how many
of each kind, the fields they share and the actions on all of them.

## When to use

Use it in place of the panel of a single thing, an
[InspectorFrame](inspector-frame.md), when several are selected. The
application counts the things of each kind and names the kinds; it
passes the editors of what the things share in `fields` and the actions
on the whole selection in `actions`. An action that removes the
selection goes in `end`, as an icon button, not among the actions.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `count` | required | The number of things selected |
| `kinds` | `[]` | The number of each kind, `{ label, count }[]` |
| `title` | `selected` message | The title in the head |
| `fields` | | The editors of what the things share (a snippet) |
| `actions` | | The actions on the whole selection (a snippet) |
| `end` | | Icon buttons in the head, before the close button (a snippet) |
| `onclose` | | Shows a close button in the head |
| `side` | `panel` | The width, as [Panel](../components/panel.md)'s `side` |

## Contract

A [Panel](../components/panel.md) with a
[Toolbar](../components/toolbar.md) as its head, titled with the count
(`3 selected` by default). The content is stacked with gap 0: the kinds
as [Stats](../components/stats.md) in a [Block](../components/block.md),
then `fields` as they are (put them in
[SectionHeader](../components/section-header.md) groups, which bring
their padding), then `actions` in a Block. Without kinds, fields or
actions, that part is left out.

## Example

[SelectionSummary](../../examples/selection-summary/)
