# Slider

Slider is the input of a value on a range.

## When to use

Use it for a value where the position matters more than the exact
number, such as an opacity. `display` shows the value with its unit;
`oninput` follows the drag and `onchange` gives the value when it is let
go. For an exact number use a [NumberInput](number-input.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | required | The value |
| `min` | `0` | The least value |
| `max` | `100` | The greatest value |
| `step` | `1` | The step |
| `display` | | The value as shown on the right, with its unit |
| `ariaLabel` | | The accessible name |
| `disabled` | `false` | Cannot be changed |
| `id` | | The id of the input |
| `oninput` | | Called with each value while dragging |
| `onchange` | | Called with the value when it is let go |

## Contract

The control is as high as a small button, and the whole of it can be
dragged. It is a native range input, so the keys and screen readers work
as the browser does. The track is two lines thick, solid on the side
that has been passed; the thumb is the square of an icon. The value sits
gap-sm to the right in a slot of fixed width, aligned to its end and
trimmed to its ink. Disabled is dimmed.

## Example

[Slider](../../examples/slider/)
