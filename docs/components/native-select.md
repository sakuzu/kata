# NativeSelect

NativeSelect is a select that opens the browser's own list.

## When to use

Use it for long lists (languages, time zones) and on phones. `groups`
puts options under headings; an option can be `disabled` to show that it
cannot be chosen now. `placeholder` adds a first line while nothing is
chosen. For options with a description use a [Select](select.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `options` | `[]` | `{ value, label, disabled? }[]` |
| `groups` | | `{ label, options }[]`, shown before `options` |
| `value` | | The chosen value (bindable) |
| `placeholder` | | The first line while nothing is chosen |
| `ariaLabel` | | The accessible name without a Field |
| `id` | | The id of the select |
| `error` | `false` | The line turns red |
| `disabled` | `false` | Cannot be changed |
| `onchange` | | Called with the chosen value |

## Contract

The control is a `<label>` of the height its container declares, with
one line in line-strong, pad-md at the sides and a chevron on the right;
the select inside is transparent. Focus turns the line blue-ink. While
the placeholder shows, the text is faint. The list takes the panel
color.

## Example

[NativeSelect](../../examples/native-select/)
