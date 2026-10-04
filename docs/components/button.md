# Button

Button is a control that is pressed to act.

## When to use

Use it for an action: `primary` for the one main action of a screen
and the default `outline` for the others. `danger` marks an action that
removes something and leads to a confirmation, whose own primary action
is `danger-fill`.
An icon button (`icon`, with an `aria-label`) is `ghost`; `ghost` is not
used for text, since text without a line does not look pressable. An
action that needs no line is a [LinkAction](link-action.md). The children
of a text button are text only: icons go in `leading` and `trailing`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `variant` | `outline` | The look, one of the five above |
| `icon` | `false` | A square button with an icon and no text |
| `aria-label` | | The name of an icon button |
| `leading` | | An icon before the text (a name or a component) |
| `trailing` | | An icon after the text, such as a menu's chevron |
| `mark` | | A mark of a value before the text (a snippet) |
| `kbd` | | A key hint after the text |
| `clamp` | `false` | The trigger of a value |
| `mono` | `false` | The text in the monospace font |
| `badge` | | A count over an icon button; 100 and more shows 99+ |
| `tip` | | The text of the tooltip; `false` turns it off |
| `shortcut` | | A key hint inside the tooltip |
| `on` | `false` | Selected, as a tool in a toolbar |
| `tone` | | `danger`: a ghost button whose text turns red on hover |
| `block` | `false` | The full width, for the action of a one-column form |
| `busy` | `false` | An action in progress: disabled, with a progress cursor |
| `disabled` | `false` | Not pressable |
| `type` | `button` | `button` or `submit` |
| `href` | | Renders a link with the same look |
| `target` | | `_blank` opens the link in another tab |
| `onclick` | | Called when pressed |
| `children` | required | The text, or the icon of an icon button |

Other attributes (`aria-*`, `data-*`) go to the element.

## Contract

The height is the one the container declares for its controls
(`--kata-box`), a button's by default: the ink of the text, pad-md above
and below, and a line on each side. A list item or a toolbar declares the
small button, with pad-sm above and below. The padding at the sides is
pad-md and an icon is gap-sm from the text. An icon button is the square
of a small button, wherever it is. The text is one line, trimmed to its
ink; a button wider than its container shrinks and ends its text with an
ellipsis. Hover shows the raise surface, pressing the stronger one; a
disabled or busy button takes no hover. Disabled is the same shape without hue:
a filled button (primary, danger-fill) takes the solid-disabled surface
and its text and is not dimmed; a button with a line (outline, danger)
takes the outline's text and line, and a ghost button the outline's
text, dimmed. Busy looks the same as disabled and differs only in its
cursor; the spinner of a running task belongs to what shows the task,
not to the button. The area that is pressed, the hover surface, the line
and the focus ring all belong to the button. A ghost button without a
pressed state (neither `on` nor `aria-pressed` nor `aria-current`: a
close button, the trigger of a menu, a chevron that opens) has no line or
surface at rest: it is laid out as its icon, and the area that is
pressed, the hover surface and the focus ring reach the control's height
around it without taking room. A ghost button that shows whether it is
chosen (a tool, a page) keeps its box. An icon button shows its
`aria-label` in a [Tooltip](tooltip.md), with `shortcut` as the key
hint; a text button shows one only when `tip` is given.

## Example

[Button](../../examples/button/)
