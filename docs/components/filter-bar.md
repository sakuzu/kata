# FilterBar

FilterBar sums up the filters in effect, under the head of a table or a
list.

## When to use

Use it when a table or a list is filtered, to show how. The filters are
built elsewhere, in a modal: pressing a filter opens it (`onedit`), and
its ✕ removes the filter (`onremove`). With no filter in effect, do not
show the bar.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `sentence` | required | How to read the filters, one sentence |
| `items` | required | The filters and the words, `FilterBarItem[]` |
| `onedit` | | Called with the id of the filter that is pressed |
| `onremove` | | Called with the id of the filter whose ✕ is pressed |

A `FilterBarItem` is a filter, `{ kind: 'filter', id, label }`, or a word
between filters, `{ kind: 'word', text }`: a word that joins them, such
as "and" or "or", or a bracket around a group.

## Contract

A container with pad-md on the raise surface with a line along the
bottom, holding two lines gap-sm apart: a funnel and the sentence
(caption), then the filters and the words, gap-sm apart, wrapping when
they do not fit. Each filter is a small button with its label on one
line, with a ✕ icon button beside it when `onremove` is given; a long
label ends with an ellipsis. The bar is a group named by the `filters`
message, and the ✕ is named by `removeFilter`.

## Example

[FilterBar](../../examples/filter-bar/)
