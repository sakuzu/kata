# SettingsRow

SettingsRow is one setting: its name and description on the left and its
control on the right.

## When to use

Use it inside a [SettingsSection](settings-section.md), one row for each
setting. The application passes the control: a
[TextInput](../components/text-input.md), a
[Toggle](../components/toggle.md) without a label of its own, a
[Select](../components/select.md) or a button that starts an action, such
as a danger button that opens a confirmation. Give the control's id in
`for` so that the name labels it; a control without an id takes an
accessible name of its own (`ariaLabel`). A setting of the thing
selected, in a panel beside the stage, is an
[InspectorRow](inspector-row.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `label` | required | The name of the setting |
| `description` | | One sentence under the name |
| `for` | | The id of the control that the name labels |
| `width` | | A fixed width for the control: `8rem`, `12rem` or `20rem` |
| `control` | | The control (a snippet); `children` serve the same |

## Contract

The name is body text and the description a muted caption gap-xs below
it; they are trimmed only where the row meets the edge of its section,
as the first or the last row. The text takes the rest of the row and the
control keeps its own width, or fills `width`, gap-lg from the text and
level with the middle of the text. Below 48rem the control moves under
the text, gap-sm from it, at the start. The row is a group named by the
name and described by the description. Controls inside take a button's
height.

## Example

[SettingsRow](../../examples/settings-row/)
