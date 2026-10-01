# CommentList

CommentList shows the conversations left on a document: each one's first
message, its replies, and the actions to open and resolve it.

## When to use

Use it in the comments panel of a drawing application. The application
passes its threads in the order it wants them, filtered as it likes
(without the resolved ones, for example). CommentList knows nothing of
where a thread is on the stage: the application draws the pins, and
moves to a thread and opens it when `onopen` is called. A reply is
written with a [CommentComposer](comment-composer.md) that the
application places where the thread opens.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `threads` | required | The threads, `CommentThread[]` |
| `onopen` | | Shows the open action; called with the thread's id |
| `onresolve` | | Shows resolve and reopen; called with `(id, resolved)` |
| `label` | "Comments" | The name of the list |
| `folded` | `false` | One row for each thread, which opens it when pressed |
| `actions` | | The application's actions of a thread: `(thread)` |
| `byline` | | In a `CommentThread`: the line under the body when folded |

A `CommentThread` is
`{ id, author, when, body, replies?, resolved?, byline? }`, and each
reply is `{ id, author, when, body }`. The `author` is
`{ name, initial, color? }`: the name, the initials in the
[Avatar](../components/avatar.md) and the person's color; `when` is the
time as the application words it. `byline` is one line that the
application words, such as the author, the time and the number of
replies; without it, the folded row shows the author's name and `when`,
joined with " · ".

## Contract

The threads are stacked with a [Divider](../components/divider.md)
between them. A thread is a [Comment](../components/comment.md) for its
first message, with a [Thread](../components/thread.md) of its replies
under it, gap-sm apart; the bodies are text that wraps. The actions sit
on the right of the first message's name: resolve (a check mark) or
reopen (an arrow back) with `onresolve`, then open (an arrow out) with
`onopen`; `actions` puts the application's own, such as a menu, before
them. A resolved thread without `onresolve` shows a green Resolved
[Badge](../components/badge.md) instead. Without threads, it shows a
[State](../components/state.md) in a [Block](../components/block.md).
The messages are `comments`, `noComments`, `openThread`, `resolve`,
`reopen` and `resolved`.

With `folded`, the threads are a [List](../components/list.md) with a
line between its items, one [ListItem](../components/list-item.md) for
each thread, of the columns `auto minmax(0, 1fr) auto`: the small
[Avatar](../components/avatar.md) of the author in the person's color;
a [Stack](../components/stack.md) of gap-sm with the body, cut with an
ellipsis after two lines, and the byline under it as a muted caption on
one line; and at the right end the green Resolved badge of a resolved
thread, or nothing. The replies, `actions` and the resolve and open
buttons are not shown. Pressing a row calls `onopen` with the thread's
id; without `onopen` the rows are not pressed. Without threads it shows
the same State.

## Example

[CommentList](../../examples/comment-list/)
