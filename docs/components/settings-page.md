# SettingsPage

SettingsPage is the frame of a settings page: the trail, the title, the
tabs and the sections.

## When to use

Use it for pages where people read and change settings. Pass the trail
to the page in `crumbs`, and the pages of the settings in `tabs` with
the `current` one; put [Section](section.md)s in the children.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The title of the page |
| `crumbs` | `[]` | The trail to the page, `{ label, href?, onclick? }[]` |
| `crumbsLabel` | | The name of the trail |
| `tabs` | | The tabs, `{ id, label, href? }[]` |
| `current` | | The id of the current tab |
| `tabsLabel` | | The name of the tabs |
| `onselect` | | Called with the id of the tab that is opened |
| `titleEnd` | | A borderless icon button beside the title (a snippet) |
| `children` | | The sections |

## Contract

A [Page](page.md) of the settings width, with a
[PageHeader](page-header.md) as its head: the [Crumbs](crumbs.md), then
the title. With tabs, the page is `flush` and the text of the tabs is
pad-lg below the title; the first section is gap-lg below the tabs'
line. Without tabs, the first section is pad-lg below the title. The
sections are stacked with gap 0; each brings its own distance and line.
Below 48rem the margin at the sides is gap-md.

## Example

[SettingsPage](../../examples/settings-page/)
