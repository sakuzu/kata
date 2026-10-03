# Toggle

Toggle is a switch for a setting that takes effect at once.

## When to use

Use it when the change applies without a separate save. A choice that is
saved with a form is a [Checkbox](checkbox.md). `between` puts the text on
the left and the switch at the right end, for a row of settings; `indent`
places a switch under the one it depends on.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `checked` | `false` | The state (bindable) |
| `label` | | The text beside the switch, which is its name |
| `ariaLabel` | | The accessible name when there is no text |
| `between` | `false` | The text on the left, the switch at the right end |
| `indent` | `false` | Under a parent switch: indented by pad-md |
| `disabled` | `false` | Cannot be changed |
| `id` | | The id of the input |
| `onchange` | | Called with the new state |

## Contract

The control is as high as a small button (`--kata-height-button-sm`), and
the whole of it is pressed, text included. The switch is a native
checkbox with `role="switch"`, as wide as a button's height and as high as
a badge; its knob sits on the left when off and on the right, on the
solid surface, when on. The text is gap-sm from the switch and trimmed to
its ink. A long text wraps instead of being cut: the control grows
downwards, and the switch stays level with the first line, centred in the
height of a small button as one line is. In a container without padding
it takes the inset of the list items at its sides. Disabled, the text
and a switch that is off are dimmed; a switch that is on takes the
solid-disabled surface with its text for the knob, not dimmed.

## Example

[Toggle](../../examples/toggle/)
