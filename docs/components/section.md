# Section

Section is a titled part of a page, such as a group of settings or a part
of a form.

## When to use

Use it on a page, stacked with gap 0. Put a status (saving, saved) on the
right of the title and a sentence that applies to the whole section in
`note`. Actions that create something start the content, in a Row; a
count ends it, in a caption. Inside a panel, use
[SectionHeader](section-header.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The title (h2) |
| `note` | | One sentence under the title |
| `status` | | A short status on the right of the title |
| `gap` | `lg` | `0`, `sm`, `md` or `lg` between the content's children |
| `flush` | `false` | The content ends with a list or a tree |
| `children` | required | The content |

## Contract

The head (title, xs, note) is gap-lg from the content. Each section has
gap-lg below it (gap-sm when `flush`, since the last list item's padding
is part of the distance; 0 for the last section). Each section after the
first draws a line along its top, with pad-lg down to the title, which is
trimmed to its ink. Buttons inside take the height of a button.

## Example

[Section](../../examples/section/)
