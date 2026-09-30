# Disclosure

Disclosure is a group that opens and closes, with its current value in
its head.

## When to use

Use it for settings that are not needed often, so that a panel stays
short. Stack several with gap 0: a line divides them. The `value` shows
what the group is set to while it is closed.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The name of the group |
| `value` | | The current value, on the right of the head |
| `open` | `false` | The content shows (bindable) |
| `ontoggle` | | Called with the new state when the head is pressed |
| `children` | | The content |

## Contract

The head is a button as tall as a list item, with pad-md at the sides,
on the raise surface (raise-2 on hover), with a chevron on the left, the
title, and the value muted at the right end; the head has
`aria-expanded` and controls the content. Open, the content is a
container with pad-md, its children gap-sm apart; controls inside have a
button's height. Disclosures next to each other touch, with a line
between them.

## Example

[Disclosure](../../examples/disclosure/)
