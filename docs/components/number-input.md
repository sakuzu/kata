# NumberInput

NumberInput is the input of a number.

## When to use

Use it for an exact number, with its unit. It is empty when `value` is
`null`; a `placeholder` can say what empty means (for example Auto).
Only short values take a fixed width, one of 6, 8 or 12rem; without
`width` it fills its container.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `null` | The number, or `null` when empty (bindable) |
| `unit` | | A unit on the right inside the control |
| `min`, `max` | | The limits |
| `step` | | The step; `any` takes decimals |
| `placeholder` | | Shown while it is empty |
| `width` | | `6rem`, `8rem` or `12rem` |
| `ariaLabel` | | The accessible name without a Field |
| `id` | | The id of the input |
| `error` | `false` | The line turns red |
| `disabled` | `false` | Cannot be focused or changed |
| `readonly` | `false` | Can be focused and selected, not changed |
| `oninput` | | Every key stroke |
| `onchange` | | The committed value |

## Contract

It is the control of a [TextInput](text-input.md). The number is aligned
to the end, with figures of equal width, and the unit is muted on the
right inside the control, trimmed to its ink.

## Example

[NumberInput](../../examples/number-input/)
