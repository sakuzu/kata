# InputGroup

InputGroup puts an input and the actions that belong to it side by side.

## When to use

Use it for the actions of an input, such as load, copy or send. These
actions go here, not in a Footer or in the head of a section.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | | The input |
| `action` | required | The actions (a snippet) |

## Contract

The input takes the width that the actions leave, and the actions sit at
the right end, gap-sm apart. Below an input width of 12rem the actions
move to the next line and stay at the right end; when even they do not
fit on one line, they wrap. Nothing reaches past the container's edge.

## Example

[InputGroup](../../examples/input-group/)
