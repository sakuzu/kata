# Tooltip

Tooltip is a short word that explains the control it wraps.

## When to use

Every icon button needs one; [Button](button.md) adds it on its own from
the button's `aria-label`, with `shortcut` as the key hint. Wrap other
controls in a Tooltip when a word helps. It holds one word or a few, and
a key hint; a sentence belongs in the page, a few settings in a
[Popover](popover.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `text` | | The word; without it nothing shows |
| `shortcut` | | A key hint, written for the platform (⌘Z) |
| `role` | `block` | `box` for a control, `icon-button` for an icon button |
| `keep` | `false` | Copies `data-keep` to the wrapper |
| `children` | required | The control |
| `inline` | `false` | Always shown beside the control, for documentation |

## Contract

The tooltip is the inverse of the page (the text colour as its surface),
in the caption role, as high as a small button with pad-sm at the sides;
the key hint has a box of its own, as high as a badge. It is
`aria-hidden`: the control's own name is what assistive technology
reads. It shows on hover after 400ms, so a pointer that only passes by
does not show it, and at once on keyboard focus; it hides at once on
leaving, on a press, on a scroll and on a resize. It goes above the
control, gap-sm away, or below (gap-lg, clear of the pointer), right or
left, whichever fits the window first, and never covers the control. It
is moved to the body, or into the open modal dialog it is in, so no
container clips it.

## Example

[Tooltip](../../examples/tooltip/)
