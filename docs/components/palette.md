# Palette

Palette shows a colour scheme as one rectangle, and chooses it when
pressed.

## When to use

Use it in a group of schemes, one of which is chosen. `label` is the
name of the scheme, which is what a screen reader says. The caller
arranges the palettes, in a Row with `wrap`, and gives the group
`role="radiogroup"`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `colors` | required | The colours, in order |
| `label` | required | The name of the scheme |
| `sel` | `false` | Chosen |
| `disabled` | `false` | Cannot be chosen |
| `onclick` | | Called when pressed |

## Contract

The rectangle is as high as a small button, each colour gap-md wide with
no gap between them, inside one line in line-strong; the chosen palette's
line is blue-ink, with no surface or shadow added. Each palette is a
`radio`. Disabled is dimmed.

## Example

[Palette](../../examples/palette/)
