# SectionHeader

SectionHeader is a titled group inside a panel: a head with the group's
name, an optional action or status and an optional note, then the
content.

## When to use

Use it to divide a panel into groups, stacked with gap 0. Text, fields
and pairs go straight in; content that reaches the edges (a list, a tree,
a table) takes `flush`. Use `rule` where the role changes and a line
should separate the groups. On a page, use [Section](section.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name of the group |
| `status` | | A short state or count on the right of the name |
| `note` | | One sentence that applies to the whole group |
| `actions` | | An action on the right of the head (a snippet) |
| `flush` | `false` | The content reaches the edges |
| `rule` | `false` | Draws a line above the group |
| `gap` | `sm` | `0`, `sm` or `md` between the content's children |
| `children` | required | The content |

## Contract

The head is as tall as the ink of the name (the label role), with
`--kata-pad-md` at the sides; the action overlaps it without adding
height, and controls in it are small buttons. The content has pad-md on
its sides and below (none with `flush`) and starts pad-md below the head,
so the head is closer to its content than to the group before it
(pad-sm plus that group's lower padding, pad-lg first or after a line).
Flush content starts gap-xs below the ink of the name. Flush content
under a head with an action keeps pad-md above it instead, so that the
action, which hangs below the head, does not reach the first row. With
`rule`, the line is pad-lg from the ink on both sides.

The status is a short state or a count on the right of the name, in the
caption role and muted, as in a [Section](section.md). A head with
`actions` does not take a status: the actions win and the status is not
shown. The note is one sentence that applies to the whole group, gap-xs
under the name, in the caption role and muted, trimmed to its ink. It is
part of the head: the distance from the head to the content (pad-md, or
gap-xs with `flush`) is measured from the note's ink, as it is from the
name's.

## Example

[SectionHeader](../../examples/section-header/)
