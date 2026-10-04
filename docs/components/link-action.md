# LinkAction

LinkAction is an action that is text only.

## When to use

Use it for a light action that does not call for a control with a line,
such as "Add a description" or "Show all", also inside a sentence. An
action that opens a modal or changes the screen is a [Button](button.md).
With `href` it is a link; `external` opens it in a new tab and adds an
arrow after the text.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `icon` | | An icon before the text (a name or a component) |
| `href` | | Renders a link |
| `external` | `false` | A destination outside the application (with `href`) |
| `disabled` | `false` | Cannot be pressed (not with `href`) |
| `onclick` | | Called when pressed |
| `children` | required | The text |

## Contract

It is a control without a line or a surface: it is laid out as the text
and the icons it shows, as text is, so it is measured like the text
around it: its line box in a layout, trimmed at the edge of a container.
The area that is pressed and the focus ring reach the control's height
around it without taking room. Outside a sentence it is a block of its
own, as wide as what it shows. There is no padding at the sides, so its
edge lines up with the text around it. The text is blue-ink, underlined
on hover. In a sentence, inside a [Text](text.md), it takes the size
and the line height of the text around it and stays on the line.
Inside something that declares a height (a list item, a toolbar) the
text is trimmed to its ink. Disabled, the text takes the text color,
dimmed.

## Example

[LinkAction](../../examples/link-action/)
