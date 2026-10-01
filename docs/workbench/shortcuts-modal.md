# ShortcutsModal

ShortcutsModal is the list of keyboard shortcuts, in a modal.

## When to use

Use it to open the list of keyboard shortcuts from a menu or a button,
with the same shortcuts the application attaches. A [Shell](shell.md)
already opens it with the help key and lists its `shortcuts`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether it is open (bindable) |
| `shortcuts` | required | The shortcuts, `{ key, label, group? }[]` (below) |
| `title` | `keyboardShortcuts` message | The title of the modal |
| `mac` | the platform | `true` writes the keys as a Mac does |
| `groups` | | The order of the groups; the others follow as they first appear |
| `onclose` | | Called when it closes |
| `inline` | `false` | The same surface in the flow, for documentation |

`key` is written as a Shell's shortcut is (`mod+z`), and `label` says
what the shortcut does. `display` lists other keys in its place, each
written as `key` is and joined with " / "; a `hidden` shortcut is not
listed. A whole `Shortcut` can be passed; `run`, `when` and `aliases`
are not read.

## Contract

A [Modal](../components/modal.md) of the md width. The shortcuts without
a group come first, as one [List](../components/list.md) without a
heading; then each group is a [Section](../components/section.md) with
the group as its title, in the order of `groups` and then in the order
the groups first appear. Each shortcut is a
[ListItem](../components/list-item.md) that is only read, with a line
under it: the label on the left, clipped to one line, and the key on the
right as a bare [Kbd](../components/kbd.md), written as the platform
writes it (⇧⌘Z on a Mac, Ctrl+Shift+Z elsewhere; `digit` as 0–9).

## Example

[ShortcutsModal](../../examples/shortcuts-modal/)
