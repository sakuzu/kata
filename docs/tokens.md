# Tokens

The tokens are the named values that components and pages use. They are
CSS custom properties with the prefix `--kata-`, defined in
`src/tokens/tokens.css` and written with the [scale](scale.md). Only three
kinds of value carry names of their own (spacing, type and color); the
rest are plain properties such as a line width or a layer order, and the
heights are named after the component they belong to.

`@sakuzu/kata/tokens.css` contains the scale and the tokens without any
global rule. `@sakuzu/kata` adds the base CSS described at the end.

## Spacing

Two scales, never mixed. The same step name means a different length in
each, and each property uses only one of them: `padding` takes `pad-*`,
`gap` and the margin of a page take `gap-*`.

| Token | Value | Measured against |
| --- | --- | --- |
| `--kata-pad-<step>` | `--kata-size-<step>` | the component's text (em) |
| `--kata-gap-<step>` | `--kata-size-<step>-rem` | the root (rem) |

The steps are 2xs, xs, sm, md, lg, xl and 2xl. Padding is in em so that a
component with larger text gets proportionally more room. Gaps are in rem
because a layout has no text of its own and must not multiply as it is
nested.

| Step | pad (inside) | gap (between) |
| --- | --- | --- |
| 2xs | an icon and its text | an icon and its text |
| xs | a badge, above and below | a label and its input |
| sm | a small button, above and below | items of one group |
| md | a button or list item, all sides | unrelated items |
| lg | the head of a page | sections of a screen |
| xl | (not used) | sections of a long page |

## Type

Nine roles, each with a size, a line height (leading), a letter spacing
(tracking) and, for the roles that head something, an offset: the
distance to the text that follows.

| Role | Scale step | Leading | Weight | Use |
| --- | --- | --- | --- | --- |
| num | display2 | half | 600 | measured values, amounts |
| title | title1 | half | 600 | the title of a page |
| h1 | title2 | half | 600 | the title of a screen |
| h2 | title3 | half | 600 | the title of a section or card |
| prose | heading | whole | 400 | reading text |
| body | body | whole | 400 | interface text |
| caption | subheading | whole | 400 | notes, dates, hints |
| label | body | half | 600 | the name of a field or group |
| glyph | capline | half | 600 | characters inside a mark |

The tokens are `--kata-text-size-<role>`, `--kata-text-leading-<role>` and
`--kata-text-tracking-<role>`, and `--kata-text-offset-<role>` for num,
title, h1, h2, prose, caption and label. The weight is set by the
component, not by a token.

- Reading text is one quarter step larger than interface text, because a
  page meant to be read does not need the density of a tool.
- A label is as large as the value it names; only its weight sets it
  apart.
- Body and caption take the running line height, because outside a
  control they wrap as paragraphs. Inside a control the text is trimmed
  and the line height has no effect.
- On an element whose language is Chinese or Japanese, every tracking
  token is 0: CJK text takes no negative letter spacing.
- Body and prose wrap pretty, so a paragraph does not end in one short
  word; the other roles wrap as they come (`text-wrap-style: auto`), as
  balancing narrows a Japanese caption and splits the words of a heading.

## Typeface metrics

The heights of controls are computed from the ink of their text, so the
tokens carry the proportions of the typeface.

| Token | Value | Meaning |
| --- | --- | --- |
| `--kata-cap` | 0.698 | the cap height, as a ratio of the em |
| `--kata-cjk-ascent` | 0.837 | the top of CJK ink |
| `--kata-cjk-descent` | 0.079 | the bottom of CJK ink |
| `--kata-ink-over` | 0 | ink above the cap height |
| `--kata-ink-under` | 0 | ink below the baseline |
| `--kata-ink` | cap + over + under | the height of one line of ink |
| `--kata-edge-top` | over, in em | added back above a trimmed line |
| `--kata-edge-bottom` | under, in em | added back below a trimmed line |

When the root element's language is Chinese, Japanese or Korean, CJK ink
reaches past the cap height and the baseline. `--kata-ink-over` becomes
the ascent minus the cap height and `--kata-ink-under` the descent, so
controls take their edges from the CJK ink.

## Color

The default theme is dark. `data-color-mode="light"` on any element
switches the elements inside it to the light values. All color tokens are
`--kata-color-<name>`.

### Surfaces

From the lowest to the highest: `ground` (the page), `panel`, `raise` and
`raise-2` (translucent, laid over the panel for hover and selection),
`fill` (an opaque surface of the same weight as raise-2) and `solid` (the
primary action), with `solid-hover`, `solid-active` and `on-solid` for the
text on it. A disabled primary action takes `solid-disabled` with
`solid-disabled-text` instead of being dimmed: the fill's grey with muted
text in the dark theme, and a paler blue with white text in the light
one.

`ground` and `panel` are the only independent surfaces: the page's and a
component's. `surface` names the opaque surface an element sits on. It is
`ground` on the page; a component that paints panel declares it with the
`surface($role)` mixin (Panel, Card, Modal, Sheet, Drawer, Floating,
Board, Menu, Dropdown, Topbar, Banner, Toast, Bubble, Pin, Gtile, Drawbar,
Select's list, ColorPicker, ChipValue, Presence's roster). A cover,
something that hides what is under it, paints `surface`: Table's sticky
column and fill head, TreeRow's actions, Counter's and Presence's rings,
ColorGrid's ring and ColorPicker's knob. Hover and selection lay raise
over it.

### Text and lines

Three levels of text: `text`, `muted` (close to text; secondary
information) and `faint` (placeholders and disabled text only). Two levels
of line: `line` and `line-strong`. Text reaches a contrast of 7:1 as a
floor, not a target; lines and icons reach 3:1.

### Hues

Four hues, each in three roles.

| Role | blue | yellow | red | green |
| --- | --- | --- | --- | --- |
| ink (text, lines) | `blue-ink` | `yellow-ink` | `red-ink` | `green-ink` |
| fill (a surface) | `blue-fill` | `yellow-fill` | `red-fill` | `green-fill` |
| on (text on fill) | `on-blue` | `on-yellow` | `on-red` | `on-green` |

An ink reaches 7:1 on the panel and on raise. The fills are the same in
both themes; blue and red carry white text, yellow and green carry dark
text, and blue and green differ in lightness as well as hue so that they
stay apart for every kind of color vision. Red, the color of destructive
actions, also has `red-fill-hover`, `red-fill-active` and `red-wash` (the
hover surface of a destructive button). There are no pale tints. Meaning
is never carried by color alone.

### Other

`focus` (the focus ring), `scrim` (the backdrop behind a modal) and
`selection` (selected text).

## Lines and corners

`--kata-border-width` is the one line width (1px). A focus ring, the
selection mark of a list item and the underline of a tab are two lines
wide. Corners are square; marks shaped as a capsule use
`--kata-radius-pill`. There are no shadows.

## Heights

Heights are named after the component they belong to, and each is a
formula of the scale: the ink of the text, the padding and the lines.

| Token | Formula |
| --- | --- |
| `--kata-height-button` | ink + md × 2 + line × 2 |
| `--kata-height-button-sm` | ink + sm × 2 + line × 2 |
| `--kata-height-icon-button` | = button-sm (a square) |
| `--kata-height-list-item` | ink + md × 2 |
| `--kata-height-list-item-two` | list-item + gap-sm + caption ink |
| `--kata-height-badge` | caption ink + xs × 2 + line × 2 |
| `--kata-height-list-item-lg` | button-sm + md × 2 |
| `--kata-height-list-item-mark` | badge + md × 2 |
| `--kata-height-thumbnail-row` | thumbnail + md × 2 |
| `--kata-height-toolbar` | = list-item-lg |
| `--kata-height-footer` | button + md × 2 |
| `--kata-height-icon` | 1rem |
| `--kata-height-thumbnail` | 2rem |

Here ink is `--kata-ink` times the component's text size, and md, sm and
xs are the sizes of the scale times the same text size: body for every
component except the badge, whose text is a caption.

## Widths

Fixed widths of layout regions, in rem so that they grow with the root
font size: `--kata-width-rail` (14.5rem), `-panel` (22.5rem), `-drawer`
(17.5rem), `-modal-sm`, `-md`, `-lg` and `-xl` (25, 35, 45 and 60rem),
`-popover` (18rem), `-toast` (22rem), `-prose` (46rem, the measure of
reading text) and `-settings` (51.25rem).

## Opacity and layers

`--kata-opacity-dim` (0.64) dims disabled or busy content; disabled text
still reaches 4.5:1. The layers, from the lowest, are
`--kata-z-floating`, `-sheet`, `-menu`, `-modal` and `-toast`.

## Fonts

`--kata-font-sans` is IBM Plex Sans, then IBM Plex Sans JP and Noto Sans
SC and TC for CJK text, then the system font. kata does not load these
fonts; an application that wants them loads them itself.
`--kata-font-mono` names only the monospace faces of the systems
(ui-monospace, SF Mono, Menlo, Consolas, Liberation Mono), so that it
never falls back to Courier; an application that loads a monospace font
of its own puts it first by setting `--kata-font-mono`.

## Base CSS

`src/base/base.css` holds the rules that apply to the whole page, and
nothing a component looks like.

- Every box is `border-box`.
- `html` and `body` take the full height, and both are painted with
  `ground`. `body` sets the text color, the sans font and the body role.
- The text size setting is `data-font-scale` on `html`: `large`,
  `larger`, `largest` and `max` set the root to 125%, 150%, 175% and 200%.
  Every length follows, through rem and em.
- `body` is the size container named `app`. Layouts query its width at
  three breakpoints: below 24rem, 48rem and 64rem. A
  [Shell](workbench/shell.md)'s root is the `app` container of what is
  inside it, with or without the base CSS.
- The margins of headings, paragraphs, lists and figures are removed, and
  lists lose their markers. Form controls lose the border, padding and
  font the browser gives them, so the only border on a control is the one
  its component draws.
- Links are `blue-ink` and underlined on hover.
- The focus ring shows for keyboard focus only, two lines wide in `focus`,
  outside the element.
- `[hidden]` always hides.
