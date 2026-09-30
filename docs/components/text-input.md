# TextInput

TextInput is the input of one line of text.

## When to use

Put it in a [Field](field.md), which gives it a name, or name it with
`aria-label`. `unit` places a unit inside on the right, `mono` sets a code
or an identifier in the monospace font, and `title` makes it the input of
a name, at the size of h2. `suggestions` lists values that may be picked
or typed over. For several lines use a [Textarea](textarea.md), for a
number a [NumberInput](number-input.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `''` | The text (bindable) |
| `type` | `text` | `text`, `email`, `password` or `url` |
| `placeholder` | | Shown while it is empty |
| `id`, `name`, `autocomplete` | | Passed to the input |
| `unit` | | A unit on the right inside the control |
| `mono` | `false` | The monospace font, with figures of equal width |
| `title` | `false` | The size and weight of h2 |
| `suggestions` | | Values to pick from, or to type over |
| `error` | `false` | The line turns red |
| `disabled` | `false` | Cannot be focused or changed |
| `readonly` | `false` | Can be focused and selected, not changed |
| `oninput`, `onchange` | | Every key stroke, and the committed value |
| `onkeydown`, `onblur` | | Passed to the input |

Other attributes (`aria-*`, `inputmode`, `maxlength`) go to the input.

## Contract

The control is a `<label>` of the height its container declares, a
button's by default, with one line in line-strong and pad-md at the
sides; a press anywhere on it focuses the input. The input inside has no
line and no ring of its own. Focus turns the control's line blue-ink,
an error turns it red-ink, and the placeholder is faint. The unit is
muted and trimmed to its ink. The width is the container's. Disabled is
dimmed.

## Example

[TextInput](../../examples/text-input/)
