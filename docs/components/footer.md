# Footer

Footer holds the actions at the bottom of a modal or a panel.

## When to use

Use it for the buttons that close or confirm a modal or a panel. Their
order is fixed: `lead` on the left, then `secondary`, `cancel` and
`primary` on the right. A destructive action is not placed here; it is the
primary action of a confirmation.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `lead` | | A status or an action on the left (a snippet) |
| `secondary` | | A secondary action (a snippet) |
| `cancel` | | The cancel button (a snippet) |
| `primary` | | The primary button (a snippet) |

## Contract

The height is at least `--kata-height-footer` (a button and pad-md above
and below), the padding is pad-md, a line runs along the top and the
buttons are gap-sm apart at the height of a button. When the buttons do
not fit beside the lead they move below it as one group. Below 48rem
everything stacks at full width: primary first, the lead last.

## Example

[Footer](../../examples/footer/)
