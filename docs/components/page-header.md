# PageHeader

PageHeader is the head of a page: a trail of links, the title and a note.

## When to use

Use it as the head of a [Page](page.md). The only control it holds is a
borderless icon button beside the title (to rename, or to open a menu).
The head of a part of the page is a [Section](section.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The title (h1) |
| `note` | | One sentence under the title |
| `crumbs` | | The trail of links above the title (a snippet) |
| `titleEnd` | | An icon button beside the title (a snippet) |

## Contract

PageHeader is text and has no height of its own: the trail (caption,
muted) is gap-md above the title, and the note (caption) gap-xs below it.
The title stays on one line and ends with an ellipsis when it does not
fit; the full text shows on hover. The Page holds the distance to the
content.

## Example

[PageHeader](../../examples/page-header/)
