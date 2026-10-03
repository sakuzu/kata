# Segmented

Segmented is an exclusive switch between two to four options.

## When to use

Use it to switch between views or modes, where every option is seen at
once. Five options or more are a [Select](select.md). An option with an
icon and no label is square and needs an `ariaLabel`. When the value is
derived from elsewhere, pass `value` and `onchange` instead of binding it.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `options` | required | `{ value, label?, icon?, ariaLabel?, disabled? }[]` |
| `value` | required | The chosen value (bindable) |
| `ariaLabel` | | The name of the group |
| `onchange` | | Called with the chosen value |

## Contract

Each option is a control of the height its container declares, a
button's by default, with pad-md at the sides; neighbours share one
line. The chosen option takes the solid surface while the outer line
stays line-strong. A disabled option is dimmed; a chosen one takes the
solid-disabled surface and its text instead, not dimmed. The text is
trimmed to its ink. The group does not wrap and does not shrink its
padding: when it does not fit, it scrolls sideways without a scrollbar.
The focus ring is drawn inside an option.

## Example

[Segmented](../../examples/segmented/)
