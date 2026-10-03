# Pager

Pager moves between the pages of a long list by number.

## When to use

Use it at the end of a long list. The pages are numbers; how they map to the
application's data (an offset, a cursor) is the application's.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `page` | required | The current page, from 1 |
| `pages` | required | The number of pages |
| `onchange` | required | Called with the page that is asked for |

## Contract

It shows the first and the last page, the current page and one page on
each side of it, with "…" for the pages between: ‹ 1 … 4 5 6 … 12 ›.
The numbers and the arrows are ghost icon buttons, squares of a small
button, gap-md apart; the current page has the selected surface and
`aria-current="page"`, and "…" is muted in a square of the same size.
Every item keeps its square: nothing in the row shrinks.
The arrows are disabled at the ends. Nothing shows for a single page.
It never wraps: when the pages do not fit in its width, the neighbours of
the current page go (‹ 1 … 5 … 12 ›), and when even that does not fit,
it scrolls sideways.
The names come from the messages `pagination`, `previousPage`,
`nextPage` and `page`.

## Example

[Pager](../../examples/pager/)
