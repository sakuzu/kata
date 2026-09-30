# Panel

Panel is a column of the screen that holds a head, content that scrolls
and a foot: a side column, a left or right panel, or a dock.

## When to use

Use it for the columns around the drawing area. Put a
[Toolbar](toolbar.md) in `head` and, when the panel has a main action, a
[Footer](footer.md) in `foot`. The content has no padding: stack lists,
a [Tree](tree.md) and [SectionHeader](section-header.md) groups with
Stack gap 0, and put text and fields in a [Block](block.md). Use `fit`
for a panel that floats over the drawing area and should be as tall as
its content, and `side="fill"` with `resizable` for a dock whose height
the user changes.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `side` | `panel` | `rail` (the side column's width), `panel` or `fill` |
| `fit` | `false` | As tall as the content, up to the container |
| `resizable` | `false` | A grip along the top edge that changes the height |
| `onresize` | | Called with the height the grip asks for, in px |
| `resizeLabel` | | The name of the grip; required with `resizable` |
| `label` | | The name of the panel as a region |
| `head` | | The head, a Toolbar (a snippet) |
| `foot` | | The foot, a Footer (a snippet) |
| `children` | | The content |

## Contract

The order is fixed: head, content, foot. The head and the foot keep
their height; only the content shrinks, and it is the only part that
scrolls. `rail` is `--kata-width-rail` wide and `panel`
`--kata-width-panel`, never wider than the container; `fill` takes the
rest of the row. The surface is the panel colour. The content has no
padding and declares pad-md as the inset of the items that reach its
edges, so a list item or a tree row brings its own padding; text in the
content without a component that brings padding is a finding of the
audit (bundle-edge). Controls inside have a button's height. The grip of
`resizable` has no look, only the resize cursor; it is pad-sm tall, the
arrow keys move it by 32px, and the application keeps the height and its
limits.

## Example

[Panel](../../examples/panel/)
