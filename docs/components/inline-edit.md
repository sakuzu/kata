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

Read, it is a control without a line, of the height its container
declares and without padding at the sides, so its edge lines up with the
text around it; hover shows the raise surface and turns the faint pencil
muted. Edited, it is a control with a blue-ink line and pad-sm at the
sides. The text of one line keeps its line box, centred in the box, and
ends with an ellipsis; inside a component that declares its height (a
list item, a toolbar) it is trimmed to its ink. Several lines wrap, and
the first line sits where a one-line control puts its text. The empty
action is blue-ink, underlined on hover. Escape does not reach a panel
or a modal around it.

Resting (read or the empty action), it has no line and no surface, so it
is text without an edge: the edge flags pass through it, and at the edge
of a container the room its box keeps above or below the ink is trimmed
and the line is trimmed to the ink on that side, as
[Text](text.md) at an edge. The distance to the edge is measured from
the text. Edited, it keeps its box.

## Example

[InlineEdit](../../examples/inline-edit/)
