# ColorGrid

ColorGrid is a grid of preset colors, of which one can be chosen.

## When to use

Use it for a small set of named colors, alone or at the top of a
[ColorPicker](color-picker.md). Each color needs a name, which is what
a screen reader says; `label` names the group.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `colors` | required | `{ hex, name }[]` |
| `value` | | The chosen color, compared without regard to case |
| `onselect` | required | Called with the hex of the pressed color |
| `label` | required | The name of the group |
| `columns` | `9` | The number of columns |

## Contract

The colors stand in columns gap-2xs apart and fill the width of the
container; each cell is a square of the color itself, with a line
inside, and nothing is placed in it. The chosen cell shows a ring inside,
two lines of the focus color and one of the surface. The group is a
`radiogroup` and each cell a `radio`.

## Example

[ColorGrid](../../examples/color-grid/)
