# Thumbnail

Thumbnail is a small picture of a document or a file, with an icon in its
place when there is no picture.

## When to use

Use it at the start of a list item, or at full width at the top of a
card. When the image fails to load, `onerror` lets the application drop
it so that the icon shows. A person is an [Avatar](avatar.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `src` | | The image; without it the icon shows |
| `alt` | `''` | The text alternative (empty when decorative) |
| `size` | `3rem` | The width in rem, or `full` |
| `icon` | `image` | The icon without an image: a name or a component |
| `onerror` | | Called when the image fails to load |

## Contract

The width is `size` and the height two thirds of it (3:2); with `full` it
fills the container at 16:10. The surface is `--kata-color-raise-2` with
one line in `--kata-color-line`, the image covers it and the icon is
centred in the muted color. Thumbnail never shrinks in a row; in a list
item it holds pad-md above and below, which makes the item as tall as
`--kata-height-thumbnail-row`.

## Example

[Thumbnail](../../examples/thumbnail/)
