# SettingsSection

SettingsSection is one group of settings on a
[SettingsPage](../components/settings-page.md): a title, a sentence that
applies to the whole group, and the rows.

## When to use

Use it for each group of a settings page, such as the general settings,
the notifications or a danger zone, and put a
[SettingsRow](settings-row.md) in it for each setting. The application
passes the words and the controls; the section only arranges them. Show
that a change was saved with `status`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `title` | required | The title of the group (h2) |
| `description` | | One sentence under the title |
| `status` | | A short status on the right of the title (saving, saved) |
| `children` | | The rows, SettingsRow |

## Contract

It is a [Section](../components/section.md): the title with the status
on the right, gap-xs, the description in a muted caption, then the rows
gap-lg below the head and gap-lg apart. The sections of a page are
stacked with gap 0; each one after the first draws a line along its top,
with pad-lg down to the title.

## Example

[SettingsSection](../../examples/settings-section/)
