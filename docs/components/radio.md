# Radio

Radio is one choice of a group in which one is chosen.

## When to use

Arrange a group with [RadioGroup](radio-group.md); use Radio on its own
when the choices do not stand in one list. The radios of one group share
`name`, and `group` holds the chosen value. A radio can carry a second
line that describes the choice.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | required | The value of this choice |
| `label` | required | The text of the choice |
| `name` | required | The name shared by the group |
| `group` | | The chosen value (bindable) |
| `description` | | A second line that describes the choice |
| `disabled` | `false` | Cannot be chosen |
| `id` | | The id of the input |
| `onchange` | | Called with the value when it is chosen |

## Contract

The first line is as high as a small button, and the whole control is
pressed. The circle is a native radio in the square of an icon; chosen,
its line and a dot inside take the solid colour. The text is gap-sm from
the circle, one line, trimmed to its ink. A description is a caption in
the column of the text, gap-xs below the first line. Disabled is dimmed.

## Example

[Radio](../../examples/radio/)
