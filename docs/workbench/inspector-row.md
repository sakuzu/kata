# InspectorRow

InspectorRow is one setting of an inspector: its name, and the control
that changes it or the value it has.

## When to use

Use it for each setting in an [InspectorSection](inspector-section.md),
so that the names line up in one column. The application passes the
control: a [TextInput](../components/text-input.md), a
[NumberInput](../components/number-input.md), a
[Select](../components/select.md), or a
[ReadValue](../components/read-value.md) for a value that is only read.
Give the control's id in `for` so that the name labels it, or an
accessible name of its own. For a list of settings described as data,
use a [FieldList](field-list.md), which draws these rows.

A switch or a count sits at the end of the row (`align="end"`). A
[Slider](../components/slider.md) or a
[Toggle](../components/toggle.md) is a small control: mark the row
`small`, so that it is as tall as the control.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name |
| `for` | | The id of the control that the name labels |
| `hint` | | A caption under the value |
| `align` | `start` | `start` fills the value column; `end` keeps its width |
| `small` | `false` | The value is a control of a small button's height |
| `top` | `false` | A value of several lines, aligned at the top |
| `children` | required | The control or the value |

## Contract

A [Pair](../components/pair.md): the name column is 7.5rem wide, muted
and trimmed to its ink, gap-sm from the value, and the name is level
with the text of the control. The row has the height of a button, or of
a small button with `small`; with a hint it grows, and the hint is a
muted caption gap-xs under the value. With `top` it is aligned at the
top and as tall as its value, and the name is level with the first line
of the value. With `start` the control fills
the value column; with `end` it keeps its own width at the right end.
The row owns the padding at its sides, as a Pair does. Below 24rem the
name sits above the value.

## Example

[InspectorRow](../../examples/inspector-row/)
