# AttributeList

AttributeList is the list of the attributes of a thing: names and
values that the user writes, read or changed where they stand.

## When to use

Use it for the data that people attach to a thing by hand, such as a
kind, a capacity or a note, in the attributes tab of an
[InspectorFrame](inspector-frame.md). It reaches the edges of its
container, as a list does: put it in a `flush`
[InspectorSection](inspector-section.md) or straight in a panel's
content. For settings the application defines, use a
[FieldList](field-list.md).

The application keeps the attributes. `items` is what the list shows,
and every change is reported by the index in `items`; the application
updates `items`, or the row goes back to what `items` holds. Names the
user must see but not change (an identifier) go in `locked`; names the
application keeps to itself go through `hide` and are not shown.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The attributes, `{ key, value }[]` |
| `onchange` | | Called with the index and the new `{ key, value }` |
| `onadd` | | Called with a new `{ key, value }`; shows the add action |
| `onremove` | | Called with the index; shows the remove buttons |
| `readonly` | `false` | Only read: a [Kv](../components/kv.md) |
| `locked` | `[]` | The names shown but not changed or removed |
| `hide` | | Leaves out the attributes whose name it returns `true` for |

## Contract

Read only, the list is a [Kv](../components/kv.md) in a
[Block](../components/block.md). Editable, each attribute is a row a
button tall, and the rows touch, as list items do: the name in a column
7.5rem wide, the value, and at the end a small ghost button that removes
it (named by the `removeAttribute` message). The name and the value are
each an [InlineEdit](../components/inline-edit.md): Enter commits,
Escape restores, and an empty value shows the `addValue` action. A name
cannot be emptied; the row goes back to it. A locked attribute is text
only, with a muted lock at the end named by the `locked` message.

The add action is a [LinkAction](../components/link-action.md) in a
Block after the rows. It opens a row of two small inputs, the name
focused: Enter, or leaving the row, adds the attribute with its name
and value trimmed; Escape, the cancel button or a row without a name
drops it. Escape does not reach a panel or a modal around it. With no
attribute to show, a Block says so (the `noAttributes` message). Below
24rem the value moves under the name.

## Example

[AttributeList](../../examples/attribute-list/)
