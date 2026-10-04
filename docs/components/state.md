# State

State is what a place shows when it is empty, loading or has failed.

## When to use

Use it in the container that would hold the content, such as a
[Block](block.md) in a panel; a notice about content that is shown is a
[Banner](banner.md). Write one sentence, at most one note and
one action. A failure takes `tone="error"`; loading takes `loading`,
which shows a [Spinner](spinner.md) with the sentence.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `text` | required | The sentence |
| `note` | | One sentence under it |
| `tone` | | `error` for a failure |
| `loading` | `false` | Shows a Spinner with the sentence |
| `actions` | | One action (a snippet) |

## Contract

No padding: the padding of its container applies. The sentence (body,
in the text color, red-ink for a failure) and the note (a muted
caption) are at the start, trimmed only at the edge of the container;
the action is at the end of its row, as in [Actions](actions.md), with a
button's height. The three are gap-sm apart. It has no picture and no
heading.

## Example

[State](../../examples/state/)
