# SourcePicker

SourcePicker is the frame of a dialog that adds something from one of
several places: the places on the left, the detail of the current one on
the right.

## When to use

Use it when something can come from more than one place, such as the
files of the device, a library shared with the team or a link. The
application passes the places, keeps the current one (`onpick` asks for
another) and draws the detail of each place with the `detail` snippet,
which receives the place. The action that adds what was chosen goes in
`primary`. When files of the device are the only place, use a
[FileInput](../components/file-input.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether the dialog is open (bindable) |
| `title` | required | The title in the head, and the name of the places |
| `sources` | required | The places, `PickerSource[]` |
| `current` | | The id of the current place |
| `onpick` | | Called with the id of the place that is pressed |
| `detail` | required | The detail of the current place (a snippet) |
| `primary` | | The action that adds what was chosen (a snippet) |
| `onclose` | | Called once when the dialog closes |
| `flush` | `false` | The detail is not in a Block; it holds its own |
| `inline` | `false` | The same surface in the flow of a page |

A `PickerSource` is `{ id, label, description?, icon? }`.

## Contract

A [Modal](../components/modal.md) of the widest size (`xl`) whose body
reaches its edges. A [Split](../components/split.md) holds the places, a
[List](../components/list.md) in a navigation landmark, on the left, and
the detail in a [Block](../components/block.md) on the right. Each place
is a pressable [ListItem](../components/list-item.md) with its icon, its
name and its description; the current one is selected. Below 48rem the
modal fills the screen and the places become [Tabs](../components/tabs.md)
above the detail. The [Footer](../components/footer.md) holds a close
button and `primary`.

With `flush` the detail is not in a Block, in both layouts: it reaches
the edges, and the `detail` snippet places its own
[Blocks](../components/block.md), [Lists](../components/list.md) and
[SectionHeaders](../components/section-header.md).

## Example

[SourcePicker](../../examples/source-picker/)
