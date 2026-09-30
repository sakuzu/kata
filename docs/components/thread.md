# Thread

Thread holds the replies to a message, under it.

## When to use

Put it after the [Comment](comment.md) it answers, in a Stack with gap
sm, and put the replies in it as Comments.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `gap` | `sm` | The distance between the replies: `0`, `sm`, `md` or `lg` |
| `children` | | The replies |

## Contract

A line along the left, and the replies pad-md from it, stacked `gap`
apart. The replies have no padding at the sides. The thread has no
margin of its own: its line stands at the edge of its column, which is
pad-md in from the edge of a container without padding, as a list item's
content is.

## Example

[Thread](../../examples/thread/)
