# InlineEdit

InlineEdit is text that is changed where it stands.

## When to use

Use it for a name or a description shown in a panel or a header, where a
field would be too heavy. Empty and editable, it shows the action
"+ placeholder"; with a value, the text and a pencil; not editable, the
text alone (nothing when empty). Enter commits and Escape restores;
`multiline` adds lines with Enter and commits on blur or ⌘/Ctrl+Enter.
When the text is emptied, the application decides what takes its place.
A name entered in a form is a [TextInput](text-input.md) in a
[Field](field.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `''` | The text (bindable) |
| `placeholder` | required | The action shown when empty |
| `onCommit` | required | Called with the changed text, trimmed |
| `editable` | `true` | `false` shows the text only |
| `title` | `false` | The size and weight of h2 |
| `multiline` | `false` | Several lines |
| `label` | | The accessible name (the placeholder by default) |
| `editing` | `false` | Being edited (bindable); `true` starts an edit |

## Contract

Read, it is a control without a line or a surface: it is laid out as
its text and the pencil, as text is (its line box in a layout, trimmed
at the edge of a container and inside a control), without padding, so
its edge lines up with the text around it. The area that is pressed and
the raise surface that hover shows reach the control's height around it
without taking room, and hover turns the faint pencil muted. Edited, it
is a control with a blue-ink line and pad-sm at the sides, of the height
its container declares, so entering the edit makes it taller. The text
of one line ends with an ellipsis; several lines wrap, with the pencil
centred on the ink of the first line. The empty action is blue-ink,
underlined on hover, laid out as LinkAction is. Escape does not reach a
panel or a modal around it.

## Example

[InlineEdit](../../examples/inline-edit/)
