# Tabs

Tabs switch between the views of one place, or between the pages of a
group.

## When to use

Use tabs without `href` to switch a view on the same page, and tabs with
`href` for pages that belong together, such as the pages of the
settings. Put them in a [Toolbar](toolbar.md) to use them as the head of
a panel. For two to four values of a setting, use a
[Segmented](segmented.md) instead.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `tabs` | required | `{ id, label, href? }[]` |
| `current` | required | The id of the current tab |
| `label` | | The name of the set of tabs |
| `onselect` | | Called with the id of the tab that is opened |

## Contract

A tab is as tall as a list item, with pad-md at the sides and its label
trimmed to its ink, muted until it is current. The current tab has
`aria-current="page"` and a double blue line along its bottom, drawn
inside it, so its height does not change. The tabs have a line along
their bottom; inside a Toolbar they take the toolbar's height and its
line instead. A tab with `href` is a link, a tab without is a button.
Only the current tab is in the tab order: the left and right arrow keys,
Home and End move the focus between the tabs, and Enter or Space opens
the focused one. When the tabs do not fit, as many as fit show and the
rest fold into a "More" [Menu](menu.md) at the right end (the `more`
message); nothing scrolls. The current tab always shows: its width is
taken first, then the others from the start as long as they fit.

## Example

[Tabs](../../examples/tabs/)
