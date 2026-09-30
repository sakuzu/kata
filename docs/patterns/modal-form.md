# A modal with a form

A form in a [Modal](../components/modal.md): the fields of one task, a
check when it is sent, and one primary action.

## When to use

Use it for a task that stops the work and asks for a few values: create,
rename, invite, export. A single question before an action is a
[Confirm](../components/confirm.md); a form that runs a process and shows
its progress is a [ProcessDialog](../workbench/process-dialog.md); many
settings that stay are a [settings page](settings.md).

## Parts

- [Modal](../components/modal.md) with a `title` that says what the task
  does. Its body stacks the fields gap-md apart.
- A [Field](../components/field.md) around each control: the name above,
  a note or an error below. The controls are
  [TextInput](../components/text-input.md),
  [Select](../components/select.md),
  [Textarea](../components/textarea.md) and the other inputs.
- A [Checkbox](../components/checkbox.md) or a
  [Toggle](../components/toggle.md) for a yes or no, without a Field.
- A [Banner](../components/banner.md) first in the body, when something
  about the task must be read before it is filled in.
- The `cancel` and `primary` snippets, which the modal places in its
  [Footer](../components/footer.md).

## Rules

- One primary action, named with a verb: Create, not OK.
- Check when the primary action is pressed, not on every key. Show the
  error in the Field of the value, with `error` on the control, and keep
  the modal open.
- The first input takes the focus when the modal opens. Below 48rem the
  modal fills the screen and its actions move into the head.

## Example

[A modal with a form](../../examples/pattern-modal-form/)
