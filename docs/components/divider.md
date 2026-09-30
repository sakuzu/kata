# Divider

Divider is one line that separates two roles.

## When to use

Use it between groups of list items and between groups of content in a
container without padding. It is never a decoration. Sections draw their
own line and do not need one.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `inset` | `false` | Keeps pad-md free at both ends |
| `gap` | `false` | Adds gap-sm above and below the line |

## Contract

The line is `--kata-border-width` thick in `--kata-color-line`, with no
margin: the space around it belongs to its neighbours, or to its own
padding with `inset` and `gap`. Text next to it is trimmed to its ink, so
the line is as far from what is above it as from what is below it.

## Example

[Divider](../../examples/divider/)
