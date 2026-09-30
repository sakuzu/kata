# A settings page

A page of settings: the trail and the title, tabs for the areas, and
groups of settings, each a name, a sentence and a control.

## When to use

Use it for settings that stay: of a team, a document, a person. A few
settings for the thing in hand go in a [panel](panel.md) or a
[Popover](../components/popover.md).

## Parts

- [SettingsPage](../components/settings-page.md): the frame, with the
  crumbs, the title and the [Tabs](../components/tabs.md).
- A [SettingsSection](../workbench/settings-section.md) for each group,
  with a `status` that says a change was saved.
- A [SettingsRow](../workbench/settings-row.md) for each setting: the
  name and a sentence on the left, the control on the right.
- A [Section](../components/section.md) with `flush` for what is not a
  setting, such as a [List](../components/list.md) of members, with the
  action that adds one at the start of its content.

## Rules

- A change is saved when it is made; there is no Save button.
- A group whose actions cannot be undone comes last, as a danger zone,
  with a danger button.
- Below 48rem each control moves under its text.

## Example

[A settings page](../../examples/pattern-settings/)
