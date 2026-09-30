# DropTarget

DropTarget is the place to drop files.

## When to use

Use it where files can be added by dragging them in, with a button that
chooses files for those who do not drag. The application handles the
drag events and the drop, and sets `over` while files are over the
place. A button alone that opens the file chooser uses a
[FileInput](file-input.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `over` | `false` | Files are being dragged over it |
| `children` | required | An icon, a sentence and a button |

## Contract

One row inside a strong line, with pad-md inside on every side and its
items gap-sm apart; when it does not fit it wraps, the lines gap-md
apart, and an item wider than the row shrinks and ends its text with an
ellipsis. Controls inside have a button's height. While `over`, the line
is blue and the surface raise. It keeps its height in a vertical flex.

## Example

[DropTarget](../../examples/drop-target/)
