# Figure

Figure is a frame for a picture that draws itself: a canvas, an SVG, an
image or a live preview.

## When to use

Use it to give a picture an edge. The picture keeps its own colours and
lines. A picture that reaches the edges of the screen, such as the drawing
surface of an editor, has no line and does not go in a Figure. Nothing
else (text, list items) goes in a Figure.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `height` | | The height of the frame as a length (`12rem`) |
| `label` | | The picture's name, when the picture has none |
| `children` | | The picture |

## Contract

Figure has no padding, one line in `--kata-color-line`, square corners and
no shadow, and it clips what overflows. Without `height`, the picture
sets the height.

## Example

[Figure](../../examples/figure/)
