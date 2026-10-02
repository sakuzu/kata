# Actions

Actions is the row of actions at the end of a container that has no
[Footer](footer.md).

## When to use

Use it at the end of a card, a panel's section or a form in a page. The
secondary action comes before the primary one, both at the right end; a
status, or a third outcome, goes at the left end in `lead`. In a modal or
a panel with a bar at its bottom, use Footer.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `lead` | | A status or an action at the left end (a snippet) |
| `secondary` | | The secondary action (a snippet) |
| `primary` | | The primary action (a snippet) |

## Contract

Actions has no height, padding or line of its own; the buttons keep
theirs. Neighbours are gap-sm apart. Secondary and primary are one
group, as in a [Footer](footer.md): when it does not fit beside the
lead, the whole group moves below it and stays at the right end.

## Example

[Actions](../../examples/actions/)
