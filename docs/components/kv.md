# Kv

Kv is a column of read [Pairs](pair.md) whose names line up.

## When to use

Use it for the attributes or the summary of a thing, given as a list of
names and values. `tight` fits the name column to the longest name, in a
narrow container such as a tile. Values that are edited are Pairs in a
Stack.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The pairs (below) |
| `tight` | `false` | The name column takes the width of the longest name |

Each item has `k` (the name) and `v` (the value), and optionally `mono`,
`muted`, `clamp`, `indent`, `href` and `note`, as on a read Pair.

## Contract

The pairs sit on one grid of two columns, so their names line up: 7.5rem
wide, or the width of the longest name with `tight`. The pairs are
gap-sm apart. Below 24rem each name sits above its value.

## Example

[Kv](../../examples/kv/)
