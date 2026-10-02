# StepBar

StepBar shows the progress through a sequence of steps.

## When to use

Use it at the top of a task in several steps, such as an import. The
steps cannot be pressed; steps that are chosen freely are
[Tabs](tabs.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `steps` | required | The names of the steps |
| `current` | required | The current step, from 1 |

## Contract

Each step is its number in a square of `--kata-height-badge` and its
name. A step that is done is filled with the solid color, the current
one has a blue line and blue number and its name in the text color,
and the steps to come have a strong line and a muted name. The number is
a glyph trimmed to its ink; the name is not trimmed. gap-sm lies between
a number and its name and between steps, and lines share the rest of the
width between the steps and shrink first. It stays on one line. When the
steps do not fit, each name goes under its number, centred and allowed
to wrap, and the lines run level with the centre of the numbers; when
even that does not fit, only the numbers show and the current step's
name is written under the bar, at the start. The form is measured, and
the wider form comes back when there is room for it again. The current
step has `aria-current="step"`.

## Example

[StepBar](../../examples/step-bar/)
