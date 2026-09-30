# Block

Block is a wrapper with padding, for content that does not reach the
edges of the container it sits in.

## When to use

Use it inside a container without padding (a panel, a menu, a split
column) to hold text, fields, name and value pairs and actions. Content
that reaches the edges (lists, trees, tables, section headers) does not go
in a Block, and a Block never sits directly in another container with
padding.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The content, usually a Stack |

## Contract

The padding is `--kata-pad-md` on all sides and there is no surface or
line. The first and the last line of text inside are trimmed to their
ink, so the distance from the edge to the text is pad-md whether the
content starts with text or a control. Inside it, stack with gap sm: the
distance between neighbours must not exceed the distance to the edge.

## Example

[Block](../../examples/block/)
