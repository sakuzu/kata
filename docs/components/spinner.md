# Spinner

Spinner shows a short wait: three dots that pulse.

## When to use

Use it for a wait of a moment, beside the text or the control that
waits; with `label` it says what happens. A longer task is a
[Progress](progress.md); an empty place that loads is a
[State](state.md). It is never large or alone in the middle of a screen.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | | The words after the dots |

## Contract

Three squares of 1 ÷ φ² of an icon's height (size-xs), gap-2xs apart,
in the muted color at three strengths; they pulse in turn, and with
reduced motion they rest. Nothing turns or blinks. It follows the
text around it, and the label is gap-sm after the dots, not trimmed. It
is a `status` for assistive technology.

## Example

[Spinner](../../examples/spinner/)
