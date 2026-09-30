# Kbd

Kbd shows a key or a keyboard shortcut.

## When to use

Use the outlined form among words: in a sentence or a tooltip. Use `bare`
in a column of shortcuts at the right end of a menu or a list. Write one
shortcut as one Kbd (`⌘K`), not one per key.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `bare` | `false` | Without the outline, for a column of shortcuts |
| `children` | | The key or the shortcut |

## Contract

The outlined form has the height of a badge (`--kata-height-badge`),
pad-xs at the sides and one line in `--kata-color-line-strong`; the text
is monospace in the caption role, trimmed to its ink and centred. The bare
form has no line or padding and is as tall as its ink. Kbd never shrinks
in a row.

## Example

[Kbd](../../examples/kbd/)
