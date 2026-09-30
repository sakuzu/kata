# Bars

Bars is a histogram: the counts of a sample in bins, as bars.

## When to use

Use it next to the inputs that set classes of values, to show the shape
of the distribution and where the breaks fall. It has no axis and no
figures, and it cannot be dragged; the inputs tell the values.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `bins` | required | The counts of the bins, from the left |
| `marks` | `[]` | The breaks, as fractions of the width from 0 to 1 |

## Contract

The bars fill the width and stand at most 4rem high; the tallest bin
fills the height. They are the blue ink, parted by a transparent line on
each side. A break is a line in the strong line color over the full
height. The chart is hidden from assistive technology.

## Example

[Bars](../../examples/bars/)
