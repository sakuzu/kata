# Field

Field gives an input its name above it and a note below it.

## When to use

Wrap every input of a form in a Field, and stack the fields in a Stack
with gap lg. `for` is the id of the control, so that the name labels it.
An error takes the place of the note. `width` fixes the width of a short
input only.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name |
| `for` | | The id of the control |
| `note` | | One sentence under the control |
| `error` | | The error, in the place of the note |
| `width` | | `6rem`, `8rem`, `12rem`, `20rem` or `28rem` |
| `children` | | The control |

## Contract

The name, the control and the note are gap-xs apart. The name is as
large as the text in the control (body) and the note is a caption, both
muted; with an error both are red-ink. They are text that is not trimmed,
except at the edge of a container. The note has the id `<for>-note`. The
controls inside take the height of a button.

## Example

[Field](../../examples/field/)
