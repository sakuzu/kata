# Progress

Progress shows the progress of a task, or that a task is running.

## When to use

Use it for a task that takes more than a moment, such as an upload.
Without a `value` it is indeterminate. A sentence such as "Importing 3
of 8 files" goes above it, in a [Stack](stack.md). How much of a limit
is used is a [Meter](meter.md); a short wait is a [Spinner](spinner.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | | The amount done; without it the bar is indeterminate |
| `max` | `100` | The amount of the whole task |
| `label` | | The name of the bar |

## Contract

A bar gap-2xs high in the line colour. With a value it fills with the
solid colour from the left, up to the share done (from 0 to 100%);
without one, a block of 30% runs across it, and with reduced motion it
rests at the centre. It is a `progressbar` for assistive technology.

## Example

[Progress](../../examples/progress/)
