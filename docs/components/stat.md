# Stat

Stat is a figure with its name below it.

## When to use

Use it for the few figures that summarise a page, such as the number of
documents or the storage used. The application writes the figure with its
unit. Several stats side by side go in [Stats](stats.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name |
| `value` | required | The figure, with its unit |
| `icon` | | An icon before the name: a name or a component |

## Contract

The figure is in the num role with figures of equal width, and the name
is a muted caption under it. Neither is trimmed, so they sit with no gap:
their line heights are the distance. The icon is centred on the name's
line, gap-2xs from it. A long name ends with an ellipsis.

## Example

[Stat](../../examples/stat/)
