# Checkbox

Checkbox is a choice among several, or a confirmation.

## When to use

Use it for options that are chosen together and saved with a form, and
for the selection of the items of a list or the rows of a table.
`indeterminate` shows that some of them are selected. A setting that
takes effect at once is a [Toggle](toggle.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `checked` | `false` | The state (bindable) |
| `indeterminate` | `false` | Some of a list is selected |
| `label` | | The text beside the box |
| `ariaLabel` | | The accessible name when there is no text |
| `disabled` | `false` | Cannot be changed |
| `id` | | The id of the input |
| `onchange` | | Called with the new state |

## Contract

The control is as high as a small button, and the whole of it is
pressed, text included. The box is a native checkbox, the square of an
icon with one line; checked, it takes the solid surface and a check mark;
indeterminate, the stronger raise surface without a mark. The text is
gap-sm from the box, one line, trimmed to its ink. Disabled is dimmed.

## Example

[Checkbox](../../examples/checkbox/)
