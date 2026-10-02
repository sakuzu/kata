# Checks

`npm run audit` checks the components against the rules of kata. It has
two parts: a reading of the sources, and a measurement of the examples in
a browser. `npm run check` runs it with the other checks of the
repository ([CONTRIBUTING](../CONTRIBUTING.md) lists them).

## The sources

`scripts/lint-components.mjs` reads the styles of the components in
`src/svelte`.

- Spacing, type and colour take a token, never a raw length or colour.
- `padding` takes the pad scale and `gap` the gap scale.
- Only the components that hold text in a control (Button, Toggle,
  TextInput and the other controls, a mark such as Badge, a list item, a
  pair or a table cell), at a container's edge (Text) or next to a line
  (Section, SectionHeader) trim text.
- No negative distance, no outer margin on a component's root (the
  layouts, Icon and Prose aside), no `@media` for a width and no `:has()`
  other than the next sibling.
- Every custom property a component reads is defined.
- Every component is exported, has an example and has a page here or in
  the [Workbench](workbench/README.md) chapter.

## The examples

The audit builds the examples and opens each one in Chromium, served by
Vite's preview server. Every example is measured at three widths (1440,
768 and 390px), at the default and the largest text size, in the dark and
the light theme, and with an English and a Japanese root. Every visible
element inside the example is measured; a finding fails the audit.

| Rule | What is measured |
| --- | --- |
| space | Padding and gaps are 0 or a step of the scale |
| margin | Outer margins appear only in Prose and Block, never negative |
| type | Font sizes are type roles; line heights are a step of the scale |
| border | Borders are 0, 1 or 2px and solid, so no border of the browser |
| height | An element with `data-h` has the height of that token |
| trim | Text is trimmed in a control, at a container's edge or at a line |
| trim-clip | Trimmed text keeps its vertical overflow, so no ink is cut |
| cursor | What can be pressed shows the pointer |
| contrast | Text reaches 7:1 on its surface (4.5:1 when disabled or dimmed) |
| focus-halo | A text field shows a 2px ring on focus |
| double-rule | No two lines run along one edge |
| double-inset | A container with padding never sits in another one |
| bundle-edge | Text in an unpadded container or surface keeps pad-md |
| inner-gap | In a padded container, neighbours are no further than the edge |
| box-touch | A control never touches the padded edge of its container |
| box-gap | Controls stacked vertically are at least md apart |
| rule-gap | A line is as far from what is above as from what is below |
| head-gap | A section header's head is pad-md from its content |
| head-near | A group's head is nearer its content than the group above |
| page-head-gap | A page's head is pad-lg from its content |
| section-head-gap | A section's head is gap-lg from its content |
| tabs-gap | Content under the line of Tabs is gap-lg away (not in a Panel) |
| read-row | A list item that is only read has a line or a surface |
| overlap | The children of a layout do not overlap |
| crush | Text is never squeezed narrower than two characters |
| fixed-frame | A Shell or an embedded root is not the frame of fixed elements |

Distances are measured from the edge of what is visible: the outline of a
component with a line or a surface, a line, the inner edge of a
container, or the ink of text. A line along one side of a component only
is an edge on that side only; from the other side the distance runs to
what is inside it (the text of tabs with a line along their bottom). An
element marked `data-kata-skip` (drawn by the browser or by another
library) is not measured.
