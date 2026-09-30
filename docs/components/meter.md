# Meter

Meter shows how much of a limit is used, such as storage.

## When to use

Use it with a name and the amount as text. Near the limit set `tone` to
`warn`, and over it to `over`; where "near" begins is the application's
choice. The progress of a task is a [Progress](progress.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | required | The amount used |
| `max` | required | The limit |
| `tone` | | `warn` near the limit, `over` past it |
| `label` | | The name, at the left above the bar |
| `text` | | The amount as text, at the right above the bar |

## Contract

The name and the amount are body text, not trimmed, gap-xs above a bar
gap-sm high. The bar is the line color and fills with the solid color
from the left, up to the share used (from 0 to 100%). `warn` turns the
fill and the amount yellow, `over` red. The bar is a `meter` for
assistive technology, named by `label`.

## Example

[Meter](../../examples/meter/)
