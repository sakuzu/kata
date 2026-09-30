# InspectorSection

InspectorSection is a titled group of an inspector, which can fold.

## When to use

Use it inside an [InspectorFrame](inspector-frame.md) to group the rows
of one tab: the fill, the stroke, the label of the thing shown. Put
[InspectorRow](inspector-row.md) rows, a [FieldList](field-list.md) or
an [AttributeList](attribute-list.md) straight in. Make a group
`collapsible` when it is long or seldom used, so that the ones that
matter stay in view. Put a small action on the whole group, such as a
reset, in `end`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The name of the group |
| `collapsible` | `false` | The group can be closed and opened |
| `open` | `true` | Whether the content shows (bindable) |
| `ontoggle` | | Called with the new state when the chevron is pressed |
| `end` | | Small buttons on the right of the head (a snippet) |
| `rule` | `false` | Draws a line above the group |
| `flush` | `false` | The content reaches the edges (a list, a tree) |
| `children` | required | The rows |

## Contract

A [SectionHeader](../components/section-header.md): the head is the
title as a label, with the actions of `end` and then the chevron on the
right, which overlap it without adding height. The chevron is a small
ghost button named by the `expand` or `collapse` message, with
`aria-expanded`; it points down while the group is open and right while
it is closed. Closed, only the head remains, and the next group follows
it as it would follow any group. The content has pad-md on its sides
and below, its rows gap-sm apart. Sections are stacked with gap 0.

## Example

[InspectorSection](../../examples/inspector-section/)
