# VersionsPanel

VersionsPanel is the list of the saved versions of a document, with the
actions to look at one and to restore it.

## When to use

Use it for the history of a document. The application passes the
versions, newest first, with the time and the author already written for
the reader, and keeps which one is shown: `onpreview` asks to show a
version, and the application passes its id back in `current`. Restoring
is the application's too; confirm it first if it cannot be undone.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `versions` | required | The versions, newest first, `VersionEntry[]` |
| `current` | | The id of the version shown |
| `onpreview` | | Called with the id of the version that is pressed |
| `onrestore` | | Called with the id of the past version shown |
| `title` | `versions` message | The title in the head |
| `empty` | `noVersions` message | What shows when there is no version |
| `onclose` | | Shows a close button in the head |
| `side` | `panel` | The width, as [Panel](../components/panel.md)'s `side` |

A `VersionEntry` is `{ id, label, when, by }`, all strings.

## Contract

A [Panel](../components/panel.md) with a
[Toolbar](../components/toolbar.md) as its head and a
[List](../components/list.md) of two-line items: the name, then when and
by whom, one line each with an ellipsis. The current version is
selected. The first version is the latest; while another one is current,
a [Footer](../components/footer.md) holds two actions, back to the latest
(the `backToLatest` message; it calls `onpreview` with the latest id)
and restore (the `restore` message, the primary action).

## Example

[VersionsPanel](../../examples/versions-panel/)
