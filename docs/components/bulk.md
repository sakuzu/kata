# Bulk

Bulk is the bar of actions on a selection.

## When to use

Use it while several items of a list are selected, with the actions
that apply to all of them. The actions on one item are a
[Kebab](kebab.md); a selection of things on the stage is a
[SelectionSummary](../workbench/selection-summary.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `count` | required | The number of selected items |
| `label` | required | The words after the number |
| `actions` | | The actions at the right end (a snippet) |

## Contract

It is as high as a toolbar, with pad-md at the sides, on the raise
surface with a strong line. The count, the words and the actions are
gap-sm apart and trimmed to their ink; the actions sit at the right end
and are small buttons. When they do not fit, the bar scrolls sideways
instead of wrapping.

## Example

[Bulk](../../examples/bulk/)
