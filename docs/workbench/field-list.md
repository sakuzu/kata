# FieldList

FieldList draws the rows of settings from a list of field specs: a name
and the control of its kind for each field.

## When to use

Use it where the settings of a thing are known as data rather than
written out: the style of a shape, whose fields depend on its kind, or
the options of a tool. The application builds the specs for the thing
selected and applies the changes; the list only draws and reports. Put
it in an [InspectorSection](inspector-section.md). For a setting that
none of the kinds fits, use `custom` and draw the control in the `field`
snippet. For settings written one by one, use
[InspectorRow](inspector-row.md).

When several things are selected, give each field the value they share,
or `mixed: true` when they differ; the change the user makes then
applies to all of them.

```svelte
<FieldList
  fields={[
    { key: 'fill', kind: 'color', label: 'Fill', value: '#2F6FDE' },
    { key: 'width', kind: 'number', label: 'Width', value: 2, unit: 'px' },
  ]}
  onchange={(key, value) => apply(key, value)}
/>
```

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `fields` | required | The fields, `FieldSpec[]` (below) |
| `onchange` | | Called with the key and the value of a committed change |
| `oninput` | | Called with the key and the value of a dragged slider |
| `oncolor` | | Called with the key of a color field pressed; no picker opens |
| `field` | | Draws a `custom` field (a snippet that receives the spec) |
| `end` | | One row after the fields, for an action on all of them (a snippet) |

A `FieldSpec` has these keys.

| Key | Description |
| --- | --- |
| `key` | The key the change is reported with |
| `kind` | The control, one of the kinds under Contract |
| `label` | The name before the control |
| `value` | The current value, as the application holds it |
| `mixed` | The things selected differ; no value shows |
| `options` | The choices of `select` and `segmented`, `{ value, label }[]` |
| `min`, `max`, `step` | The range of `number` and `slider` |
| `unit` | Text after the value (`px`, `%`, `°`) |
| `placeholder` | A word shown while a text or a number is empty |
| `disabled` | The control cannot be changed |
| `hint` | A caption under the control |

## Contract

Each field is an [InspectorRow](inspector-row.md), the rows gap-sm
apart, with the control of its kind.

| Kind | Control | Reported value |
| --- | --- | --- |
| `text` | [TextInput](../components/text-input.md) | The text, on change |
| `number` | [NumberInput](../components/number-input.md) | A number, or null when emptied |
| `select` | [NativeSelect](../components/native-select.md) | The option's value |
| `color` | A button with a [Swatch](../components/swatch.md) that opens a [ColorPicker](../components/color-picker.md) | `#RRGGBB`, at each pick |
| `toggle` | [Toggle](../components/toggle.md), at the end of the row | `true` or `false` |
| `slider` | [Slider](../components/slider.md), with the value and the unit | A number, when let go |
| `segmented` | [Segmented](../components/segmented.md) | The option's value |
| `custom` | The `field` snippet | What the snippet reports |

The list does not convert the values: a unit is text after the value,
and the application keeps the meaning of each number. A text or a
number is reported when it is committed (Enter or leaving the input),
not at each key; a number that cannot be read is not reported. A slider
shows its value while it is dragged and reports it with `onchange` once,
when let go; `oninput` receives each value while it is dragged, for a
preview. With `oncolor`, the button of a color field shows its swatch
and its value as before but opens no picker: it calls `oncolor` with the
key, and the application opens its own picker where it wants and
applies the color itself. `end` is one [Row](../components/row.md)
after the fields, gap-sm below the last one, for an action on the whole
list, such as a reset as a [LinkAction](../components/link-action.md).
A field with `mixed` shows no value (an empty input, no chosen option,
a button without a swatch, the thumb at the start) and the `mixed`
message as its hint. Without a `field` snippet, a `custom` field shows
its value as text.

## Example

[FieldList](../../examples/field-list/)
