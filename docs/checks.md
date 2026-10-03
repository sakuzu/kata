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
  (Section, SectionHeader) trim text. The seat of a mark trims an empty
  line, and so does the summary of Prose, which seats its chevron.
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
| tabs-gap | Content under Tabs is gap-lg away (not in an unpadded container) |
| read-row | A list item that is only read has a line or a surface |
| first-line | A mark in a seat is centred on the ink of the first line |
| near | A control's description is nearer its label than the next one's |
| overlap | The children of a layout do not overlap |
| crush | Text is never squeezed narrower than two characters |
| fixed-frame | A Shell or an embedded root is not the frame of fixed elements |
| scroll-mark | A region that overflows shows a size-sm scrollbar on that axis |
| thumb | The thumb of that scrollbar reaches 3:1 on the region's surface |

Distances are measured from the edge of what is visible: the outline of a
component with a line or a surface, a line, the inner edge of a
container, or the ink of text. A line along one side of a component only
is an edge on that side only; from the other side the distance runs to
what is inside it (the text of tabs with a line along their bottom). An
element marked `data-kata-skip` (drawn by the browser or by another
library) is not measured.

head-gap allows two exceptions. Flush content under a head with an
action keeps pad-md above it, so that the action that hangs below the
head does not reach the first row, and its distance from the head may
grow by that padding and the action's overhang. Flush content without
an action keeps gap-xs above it, and its distance may grow by that gap.
head-near allows the first group to lie further from its head by the
action's overhang, and the second by the gap-xs.

first-line measures every seat ([a mark beside
text](measuring.md#a-mark-beside-text)): an element whose `::before` is
an empty line trimmed to its ink. The centre of the mark it holds is
within 0.06px of the centre of the ink of the first line of the text
beside it (the nearest sibling after it that holds text, else before
it). The ink runs from the cap height to the baseline of the font,
measured with a trimmed line placed before the text, and with a Japanese
root it also takes the CJK ink above and below them, as a trimmed line
does. The chevron of a Prose summary is drawn by the summary's own
`::before` and is not measured.

scroll-mark measures every element that overflows on an axis with
`overflow` auto or scroll ([Regions that
scroll](layout.md#regions-that-scroll)): the box less its borders and
its client size on that axis is the track's thickness, within 1.5px, as
the client size is whole pixels and the scrollbar snaps to them. A
hidden scrollbar measures 0. thumb composes `thumb` over the surface of
the region and its ancestors, as contrast does for text. The audit runs
Chromium without Playwright's hidden scrollbars, and hides only the
page's own scrollbar, so that the three widths are the content's. The
embed example puts kata under a root (`data-kata-root`) in a page that
sets its own scrollbar colors, without the base CSS; the audit reads the
tokens from the root of what it measures, so every check, scroll-mark
included, measures the embed as it measures a page.

near measures a control with a description (a radio, a checkbox or a
switch, which marks itself `data-control`) that another control
follows: the distance from the ink of its label to the ink of its
description is less than the distance from the ink of its last line to
the ink of the next control's label.
