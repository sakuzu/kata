# Comment

Comment is one message of a conversation: who wrote it, when, and what.

## When to use

Use it for messages left on a document, stacked in a column or as the
replies of a [Thread](thread.md). The application passes the name, the
initials of the person's [Avatar](avatar.md) and the time as it words
them; `edited` adds a note such as "(edited)"
after the time. Actions on the message, such as a menu, go in
`actions`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `name` | required | The name of the person who wrote it |
| `initial` | required | The initials in the person's Avatar |
| `time` | | When it was written |
| `edited` | | A note after the time |
| `actions` | | The actions on the right of the name (a snippet) |
| `children` | | The body |

## Contract

The head takes its height from its content, with pad-md above and
below. The small Avatar sits in the first column, centred on the first
line; the first line, as tall as an icon button, holds the name (one
line with an ellipsis) and the actions at the right end; the second line
holds the time (caption). The name and the time never share a line, so
neither is cut in a narrow column. The body follows below, in the name's
column, as text that is not trimmed, with pad-md below. At the sides it
follows list items: pad-md in a container without padding, none in a
container with padding. The distance between comments belongs to the
Stack or the Thread around them.

## Example

[Comment](../../examples/comment/)
