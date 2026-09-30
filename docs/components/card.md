# Card

Card is a container with padding and a line, for something to read.

## When to use

Use it for a small block of text with at most an action, such as a plan
or a summary. `danger` marks a group of actions that remove something. A
list does not go in a card.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `gap` | `sm` | The distance between the children: 0, `sm`, `md` or `lg` |
| `danger` | `false` | A red line |
| `children` | required | The content |

## Contract

pad-md on every side, whatever it holds; the first and the last line of
text are trimmed at its edges. A line around it (red with `danger`) and
the panel surface. The content is a Stack with `gap`. Controls inside
have a button's height.

## Example

[Card](../../examples/card/)
