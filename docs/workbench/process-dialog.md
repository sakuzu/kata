# ProcessDialog

ProcessDialog is the frame of a dialog that runs a process: what it
does, its fields, and the actions to run it or to cancel it.

## When to use

Use it for an operation that takes settings before it runs, such as a
conversion, an export or an operation on a selection. The application
passes the fields as children, runs the process on `onrun`, sets
`running` (and `progress` when it can tell) while it runs, and closes the
dialog when it is done. It shows why a run failed in `error`, and stops a
run on `oncancel`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `open` | `false` | Whether the dialog is open (bindable) |
| `title` | required | The title in the head |
| `description` | | What the process does, above the fields |
| `error` | | Why the last run failed, in a red notice at the top |
| `runLabel` | `run` message | The run action |
| `runningText` | `running` message | What shows while running |
| `running` | `false` | The process runs |
| `progress` | | How far it is, 0 to 100; without it, indeterminate |
| `disabled` | `false` | The run action cannot be pressed |
| `onrun` | | Called when the run action is pressed |
| `oncancel` | | Called when the user closes the dialog |
| `size` | `md` | The width, as [Modal](../components/modal.md)'s `size` |
| `inline` | `false` | The same surface in the flow of a page |
| `children` | | The fields |

## Contract

A [Modal](../components/modal.md) whose body reads in a fixed order: the
error in a [Banner](../components/banner.md), the description, then the
fields, gap-lg apart; the three are gap-md apart. The
[Footer](../components/footer.md) holds cancel and the run action, the
primary one. While running, the body shows a
[Spinner](../components/spinner.md) with the running text and a
[Progress](../components/progress.md) instead, and the run action is
busy. Cancel, the close button and Escape call `oncancel` whenever they
close the dialog, also while it runs; when the application closes it by
setting `open` to false, `oncancel` is not called.

## Example

[ProcessDialog](../../examples/process-dialog/)
