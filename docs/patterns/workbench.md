# A workbench

The whole screen of a drawing application: the bar, the layers, the
stage with its tools, and the inspector of what is selected.

## When to use

Use it once, as the frame of the editor. Pages around the editor, such
as a list of documents or the settings, are [pages](../layout.md#a-page).

## Parts

- [Shell](../workbench/shell.md), which places the regions and holds the
  keyboard shortcuts.
- A [Topbar](../components/topbar.md) in `top`, with the menu of the
  application as a `MenuModel`, the name of the document in the centre
  and the buttons that show the side regions at the end.
- A [Panel](../components/panel.md) with a
  [LayerTree](../workbench/layer-tree.md) in `left`.
- The drawing surface in `stage`: the application's own element.
- A [Drawbar](../components/drawbar.md) in `bottom`, with the tools.
- In `right`, an [InspectorFrame](../workbench/inspector-frame.md) with
  [InspectorSection](../workbench/inspector-section.md) groups and a
  [FieldList](../workbench/field-list.md) for one thing, a
  [SelectionSummary](../workbench/selection-summary.md) for several, and
  a plain panel when nothing is selected.

## Rules

- The application owns the data: the parts report what the person does
  (a selection, a rename, a new value) and the application applies it
  and passes the new state back.
- The side regions float over the stage from 48rem (or stand beside it
  from 64rem with `side="beside"`) and become sheets below; the
  application only says whether each is open.
- Every tool and panel has a shortcut, listed by the help key.

## Example

[A workbench](../../examples/pattern-workbench/)
