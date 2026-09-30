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

A `CommentThread` is `{ id, author, when, body, replies?, resolved? }`,
and each reply is `{ id, author, when, body }`. The `author` is
`{ name, initial, color? }`: the name, the initials in the
[Avatar](../components/avatar.md) and the person's color; `when` is the
time as the application words it.

## Contract

The threads are stacked with a [Divider](../components/divider.md)
between them. A thread is a [Comment](../components/comment.md) for its
first message, with a [Thread](../components/thread.md) of its replies
under it, gap-sm apart; the bodies are text that wraps. The actions sit
on the right of the first message's name: resolve (a check mark) or
reopen (an arrow back) with `onresolve`, then open (an arrow out) with
`onopen`. A resolved thread without `onresolve` shows a green Resolved
[Badge](../components/badge.md) instead. Without threads, it shows a
[State](../components/state.md) in a [Block](../components/block.md).
The messages are `comments`, `noComments`, `openThread`, `resolve`,
`reopen` and `resolved`.

## Example

[CommentList](../../examples/comment-list/)
