# RadioGroup

RadioGroup is a group of radios, one of which is chosen.

## When to use

Use it for two to four choices, especially when they carry a
description. For more choices use a [Select](select.md); for a switch
between views use [Segmented](segmented.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `options` | required | `{ value, label, description? }[]` |
| `value` | | The chosen value (bindable) |
| `name` | required | The name of the group, unique on the screen |
| `disabled` | `false` | None can be chosen |

## Contract

The radios are stacked with gap 0: each one already has the height of a
small button, and a description adds its lines below its own choice.

## Example

[RadioGroup](../../examples/radio-group/)
