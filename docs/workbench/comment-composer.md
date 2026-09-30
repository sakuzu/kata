# CommentComposer

CommentComposer is where a comment or a reply is written and posted.

## When to use

Use it under a thread for a reply, at the foot of a comments panel, or
where a new comment is started on the stage. The application posts the
text in `onpost` and decides what a failure means; the composer keeps
the text when the post fails. Text that is not posted, such as a note,
goes in a [Textarea](../components/textarea.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `onpost` | required | Called with the trimmed text |
| `placeholder` | "Write a comment" | The placeholder and the accessible name |
| `submitLabel` | "Post" | The text of the button |
| `value` | `''` | The text being written (bindable) |
| `oncancel` | | Called with Escape |
| `disabled` | `false` | Nothing can be written or posted |
| `autofocus` | `false` | Takes the focus, with the caret at the end |

## Contract

It is an [InputGroup](../components/input-group.md): a
[Textarea](../components/textarea.md) of one line that grows to four
and then scrolls, and a primary [Button](../components/button.md) on its
right, which moves under it when the column is narrow. Enter posts and
Shift+Enter starts a new line; while a character is being composed (an
input method), Enter is the input method's. Escape calls `oncancel`.
Empty text is not posted and the button is disabled. `onpost` receives
the text trimmed at both ends; when it returns a promise, the composer
waits for it, and it clears the text unless the result is `false`. The
messages are `writeComment` and `post`.

## Example

[CommentComposer](../../examples/comment-composer/)
