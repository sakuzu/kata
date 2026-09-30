# Table

Table sets rows of values in aligned columns.

## When to use

Use it to compare things by their columns. Names with a state are a
[List](list.md). On a narrow screen the rows can fold into
[Tcard](tcard.md). The author writes the header cells and the rows:

```svelte
<Table>
  {#snippet head()}<th>Name</th><th data-align="end">Size</th>{/snippet}
  <tr><td>Report</td><td data-align="end">1.2 MB</td></tr>
</Table>
```

A column of numbers takes `data-align="end"` on its cells, a column of
long text `data-clamp`, a column of row numbers `data-idx`. A header
holds text or a [ColHead](col-head.md). A selected row is
`<tr aria-selected="true">`; a row that opens something takes a
`tabindex`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `head` | required | The header cells (a snippet of `th`) |
| `children` | required | The rows (`tr`) |
| `rows` | | The least row height: `mark`, `box`, `thumb` or `two` |
| `dividers` | `false` | Lines between the header cells |
| `sticky` | `false` | Keeps the first and the last column in place |
| `fill` | `false` | Fills its container and scrolls itself |
| `el` | | The element that scrolls (bindable) |
| `onscroll` | | Called when it scrolls |

## Contract

A header is body text in the heavy weight, with a line under it and the
height of a list item. A cell is at least as tall as a list item of text
and has a line under it; stacked content makes it grow to the content
and md above and below. `rows` raises the least height of every row to a
list item that holds a mark, a small button, a thumbnail or two lines,
so that the rows line up. Cells have pad-sm at the sides, the outer
columns pad-md; their text is trimmed to its ink and does not wrap, so a
wide table scrolls sideways. Controls in a cell are small buttons. Hover
and selection show the raise surface; a selected row has a blue line of
two at the left. With `fill` the headers stay at the top on the panel
surface; with `sticky` the outer columns stay on the ground surface.

## Example

[Table](../../examples/table/)
