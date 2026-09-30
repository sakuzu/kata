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
| `disabled` | `false` | Keeps its place but cannot be pressed |
| `onclick` | | Called when pressed |
| `children` | | The text |

## Contract

In a layout its height is the line box of its text, so it is measured
like the text around it; the area that is pressed reaches the height of
an icon button. There is no padding at the sides, so its edge lines up
with the text around it. The text is blue-ink, underlined on hover.
Inside something that declares a height (a list item, a toolbar) the
text is trimmed to its ink. Disabled, the text takes the text colour,
dimmed.

## Example

[LinkAction](../../examples/link-action/)
