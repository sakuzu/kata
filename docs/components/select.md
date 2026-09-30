# Select

Select chooses one value from a list of its own.

## When to use

Use it for five options or more, or options with a description. Two to
four options are a [Segmented](segmented.md) or a
[RadioGroup](radio-group.md); a long list, or a phone, calls for a
[NativeSelect](native-select.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `options` | required | `{ value, label, description? }[]` |
| `value` | | The chosen value (bindable) |
| `placeholder` | `''` | The text while nothing is chosen, faint |
| `ariaLabel` | | The accessible name without a Field |
| `id` | | The id of the trigger |
| `error` | `false` | The line turns red |
| `disabled` | `false` | Does not open |
| `onchange` | | Called with the chosen value |

## Contract

The trigger is the control of a button, of the height its container
declares, with the chosen label on the left, one line with an ellipsis,
and a chevron on the right; its line is blue-ink while the list is open.
The list is a popover, so it shows above everything, below the trigger,
at least as wide as it and 12rem, and never wider than the window; it
opens upward when there is no room below. It has the panel surface and
one line in line-strong. Each option is as high as a list item, with
pad-md at the sides and a check mark on the left of the chosen one; an
option with a description has two lines gap-xs apart and pad-md above
and below. The arrow keys, Home and End move between the options, Enter
or Space chooses one, and a press outside, Escape or Tab closes the list;
Escape returns the focus to the trigger.

## Example

[Select](../../examples/select/)
