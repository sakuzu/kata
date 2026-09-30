# A panel

A panel is a side of the screen: a head with its title and actions,
content in groups that scrolls, and an optional foot.

## When to use

Use it for what stays open next to the work: the contents, the
properties of what is selected, a search, the comments. A task that
stops the work is a [modal](modal-form.md); a panel that slides over
the page is a [Drawer](../components/drawer.md). For the properties of
the selection, the [InspectorFrame](../workbench/inspector-frame.md) is a
panel with this shape already.

## Parts

- [Panel](../components/panel.md) with `side` for its width.
- A [Toolbar](../components/toolbar.md) in `head`, with the title, a
  line along its bottom and icon buttons at the end.
- The content, a [Stack](../components/stack.md) with gap 0 of
  [SectionHeader](../components/section-header.md) groups. A group holds
  fields and switches, or, with `flush`, a
  [List](../components/list.md) or a [Tree](../components/tree.md) that
  reaches the edges.
- A [Block](../components/block.md) for text that is not in a group.
- A [Footer](../components/footer.md) in `foot` when the panel applies
  its changes at once.

## Rules

- The content has no padding: lists and groups reach the edges and
  bring their own. Text and fields go in a group or a Block.
- Groups are apart by their own heads, never by a gap.
- The head and the foot keep their height; only the content scrolls.

## Example

[A panel](../../examples/pattern-panel/)
