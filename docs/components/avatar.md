# Avatar

Avatar is the round mark of a person, with their initials.

## When to use

Use it alone beside a name, or with `in` at the start of a list item or
in a toolbar. It takes initials only. A thing that is not a person is a
[Tile](tile.md) or a [Thumbnail](thumbnail.md); the people who are here
now are a [Presence](presence.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `initial` | required | One or two characters |
| `in` | `false` | The small size, inside a list item or a toolbar |

## Contract

A circle of `--kata-height-button-sm`, or of `--kata-height-badge` with
`in`. The surface is the opaque fill colour, so that overlapping
avatars do not show through; a container gives a person a colour by
setting `--kata-color-fill`. The initials are a caption (a glyph with
`in`) in the heavy weight, trimmed to their ink and centred.

## Example

[Avatar](../../examples/avatar/)
