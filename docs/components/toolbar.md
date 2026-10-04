# Toolbar

Toolbar is the head of a container: a title and its actions on one line.

## When to use

Use it as the head of a [Panel](panel.md), a modal or a sheet. It always
holds at least one action; a title alone is a heading, not a toolbar.
Use `rule` when the content below does not start with a line of its own,
`tail` when the last action is an icon button, and `two` for a title
with a second line. Without `title`, the children are free, such as
[Tabs](tabs.md), which take the toolbar's height and meet its line.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | | The title, h2 on one line |
| `titleId` | | The id of the title, for `aria-labelledby` |
| `rule` | `false` | A line along the bottom |
| `tail` | `false` | The last action is an icon button |
| `two` | `false` | A title with a second line: the height grows |
| `start` | | Before the title, such as back or close (a snippet) |
| `end` | | The actions at the right end (a snippet) |
| `children` | | Free content after the title |

## Contract

The height is fixed: a small button with pad-md above and below
(`--kata-height-toolbar`), with pad-md at the sides, and the controls
inside are small buttons. The title is h2, trimmed to its ink, on one
line with an ellipsis; nothing inside wraps. The actions sit at the right
end, icon buttons side by side. With `tail` the padding on the right is
pad-sm, so the icon's strokes line up with the content below. With `two`
it is a container with padding: the height follows the content, with
pad-md above and below, and the items side by side are all at its edges,
so the first line of the title and the last line under it are trimmed
there and their ink is pad-md from the edge. A control without a line or
a surface inside reaches into that padding. It keeps its height in a
vertical flex.

## Example

[Toolbar](../../examples/toolbar/)
