# Textarea

Textarea is the input of text of several lines.

## When to use

Use it for a description, a comment or a note. `rows` sets the least
number of lines and `maxRows` the most it grows to; beyond them the text
scrolls inside. The keys (send with Enter, cancel with Escape) are the
caller's, through `onkeydown`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `''` | The text (bindable) |
| `placeholder` | | Shown while it is empty |
| `rows` | `2` | The least number of lines |
| `maxRows` | | The most lines it grows to |
| `ariaLabel` | | The accessible name without a Field |
| `id` | | The id of the textarea |
| `error` | `false` | The line turns red |
| `disabled` | `false` | Cannot be focused or changed |
| `onchange`, `onblur` | | The committed value, and the loss of focus |
| `onkeydown` | | The keys |
| `el` | | The textarea element (bindable) |

## Contract

It is the control of a [TextInput](text-input.md), whose height grows
with the text. The lines take the running line height of body, and the
padding above and below makes one line as high as a TextInput, with the
text in the same place. Focus shows once, on the control's line; an
error turns it red-ink.

## Example

[Textarea](../../examples/textarea/)
