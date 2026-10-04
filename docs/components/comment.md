# Comment

Comment is one message of a conversation: who wrote it, when, and what.

## When to use

Use it for messages left on a document, stacked in a column or as the
replies of a [Thread](thread.md). The application passes the name, the
initials of the person's [Avatar](avatar.md) and the time as it words
them; `edited` adds a note such as "(edited)" after the time. Actions on
the message, such as a menu, go in `actions`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `name` | required | The name of the person who wrote it |
| `initial` | required | The initials in the person's Avatar |
| `time` | | When it was written |
| `edited` | | A note after the time |
| `color` | | The person's color on their Avatar, a CSS color |
| `actions` | | The actions on the right of the name (a snippet) |
| `children` | required | The body |

## Contract

The head is a list item that is not pressed: at least as tall as the
list's items, its height comes from its content, with pad-md above and
below, and the name and the time are trimmed to their ink. The small
Avatar sits in the first column, in a seat centred on the ink of the
first line; the first line holds the name (one line with an ellipsis)
and the actions at the right end, and is as tall as the taller of them;
the second line holds the time (caption). The name and the time never
share a line, so neither is cut in a narrow column. The body follows
below, in the name's column, as text, with pad-md below; that padding is
the comment's edge, so the last line of the body is trimmed there. Its
padding above and below is the distance to the edge, so it
sits in a container without padding, as a list item does, with pad-md at
the sides. The distance between comments belongs to the Stack or the
Thread around them.

## Example

[Comment](../../examples/comment/)
