# Gtile

Gtile is one tile of a grid of things shown with a picture, such as
documents or folders.

## When to use

Use it in a [Grid](grid.md), one tile per thing; a thing without a
picture is a [ListItem](list-item.md). The whole tile is pressed: it takes
`onclick` or `href`, and a `label` that names it. The picture goes in
`thumb` (a [Thumbnail](thumbnail.md) with `size="full"`), the title and
the details in `children`, and a menu button in `actions`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `onclick` | | Called when the tile is pressed |
| `href` | | Makes the tile a link |
| `label` | | The name of the tile |
| `sel` | `false` | Selected |
| `thumb` | | The picture, edge to edge |
| `actions` | | Actions at the top right |
| `children` | required | The title and the details |

## Contract

A line around it on the panel surface; the picture reaches the edges,
and only the body has padding (pad-md). The body is a Stack with gap 0,
so a title and a caption are set by their line heights. A pressed
element covers the whole tile and shows the raise surface on hover and
the focus ring inside; the actions sit above it, gap-sm from the body,
and below 24rem over the top right of the picture. Selected is a blue
line of two inside. Controls inside are small buttons.

## Example

[Gtile](../../examples/gtile/)
