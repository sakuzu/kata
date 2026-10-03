# Radio

Radio is one choice of a group in which one is chosen.

## When to use

Use it on its own when the choices do not stand in one list; a group in
one list is a [RadioGroup](radio-group.md). The radios of one group share
`name`, and `group` holds the chosen value. A radio can carry a second
line that describes the choice, and a note under the label (a snippet).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | required | The value of this choice |
| `label` | required | The text of the choice |
| `name` | required | The name shared by the group |
| `group` | | The chosen value (bindable) |
| `description` | | A second line that describes the choice |
| `note` | | A note under the label, in the column of the text (a snippet) |
| `disabled` | `false` | Cannot be chosen |
| `id` | | The id of the input |
| `onchange` | | Called with the value when it is chosen |

## Contract

The first line is as high as a small button, and the whole control is
pressed. The circle is a native radio in the square of an icon; chosen,
its line and a dot inside take the solid color. The text is gap-sm from
the circle, one line, trimmed to its ink. A description is a caption in
the column of the text, trimmed to its ink, gap-xs below the first line,
and so is a note, gap-xs below what is above it; pad-sm lies below the
last of them, so that a description is nearer its own label than the
label of the next radio. In a [RadioGroup](radio-group.md) the radios
stay stacked with gap 0. Disabled is dimmed.

## Example

[Radio](../../examples/radio/)
