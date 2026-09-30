# Pair

Pair sets a name and a value side by side: a control, or text to read.

## When to use

Use it for the settings of a selection in a panel, where the names form
one column at the left. The default is a value that is edited; `read`
is a value to read (a summary, the attributes of a thing) and `top` a
value of several lines, such as a Textarea. Stack pairs in a
[Stack](stack.md) with gap sm, and do not mix edit and read pairs in one
column; a column of read pairs is a [Kv](kv.md). A form with names
above the inputs uses [Field](field.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name |
| `for` | | The id of the control the name labels |
| `href` | | Makes the name a link |
| `read` | `false` | A value to read, not a control |
| `top` | `false` | A value of several lines, aligned at the top |
| `note` | | A caption under the value |
| `tight` | `false` | The name column takes the width of the name |
| `indent` | `0` | The depth of a read name in a tree of values |
| `muted` | `false` | A weaker read value (empty or inherited) |
| `mono` | `false` | The value in the monospace font |
| `clamp` | `false` | The value on one line with an ellipsis |
| `children` | required | The control or the value |

## Contract

The name column is 7.5rem wide, gap-sm from the value, and the name is
muted, trimmed to its ink and level with the first line of the value.
An edit pair has the height of a button (`--kata-box`) and its control
fills the column. A read pair, a pair with a note and a `top` pair take
the height of their content; the note is gap-xs under the value.
`indent` moves the name by md for each level. The pair owns the padding
at its sides: the inset its container declares, none inside a container
with padding. Below 24rem the name sits above the value.

## Example

[Pair](../../examples/pair/)
