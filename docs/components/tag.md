# Tag

Tag is the label of a kind: what a thing is, such as a draft, a template
or a plan.

## When to use

Use it for what does not change over time; a state is a
[Badge](badge.md). In one line, Tags come before Badges. A tag is never
pressed.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tone` | | `blue`, `green`, `yellow` or `red` |
| `children` | | The word |

Without `tone` the tag is neutral.

## Contract

A tag has the outline of a badge: the height `--kata-height-badge`,
pad-sm at the sides, a caption trimmed to its ink and round corners. A
hue is its fill with the text on it; neutral is a strong line and text.

## Example

[Tag](../../examples/tag/)
