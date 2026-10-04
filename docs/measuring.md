# Measuring

A distance in kata runs between two things you can see. This chapter says
where the edge of each thing is, which scale a distance takes, and how the
width of the window changes a layout. The [checks](checks.md) measure the
examples by the same rules.

## The visible edge

Eight things have an edge.

- A component with a line or a surface: the outside of its outline.
- A control without a line or a surface (an InlineEdit at rest, a
  LinkAction, a ghost button that is not pressed): its text or its icon,
  laid out and trimmed as text. Only its height is what it shows; its
  width stays the control's (the square of an icon button, the padding at
  the sides of a text button). Its hit area, hover surface and focus ring
  reach the control's height (its reach) around it without taking room.
  A line never cuts the reach: directly inside a component with a line
  or a surface (a [Floating](components/floating.md) used as a bar, with
  nothing between them that declares a height or padding of its own), the
  control is laid out at its reach, so that the component holds the whole
  shape. A browser without container style queries (Firefox before 151)
  does not lay it out so: the shape reaches across the line there, and is
  still pressed and shown on hover as a whole.
- The cells of a set that shows which one is chosen (the glyphs of a
  [Glyphs](components/glyphs.md), the pages of a
  [Pager](components/pager.md), the colors of a
  [ColorGrid](components/color-grid.md)): each cell's box, chosen or not.
- A line (a [Divider](components/divider.md), or the line a section draws
  along its top).
- A container with padding: the inside of its border.
- Text: its ink, from the top of the capitals to the baseline.
- An icon: the square it is drawn in, the size of an icon. An icon that
  hangs from a seat of no height has no edge of its own.
- A region that scrolls: the outside of its scrollbar, on the side the
  scrollbar runs along.

Anything else, such as the box of a layout or a wrapper, has no edge of its
own; a distance to it runs to the first visible thing inside it.

## Text and its ink

A line of text sits in a line box that is taller than its ink: the half of
the leading above the capitals and below the baseline is empty. kata trims
that space away in three places only, so that the ink sits exactly where
the scale says.

```text
  untrimmed (Text in a Stack)        trimmed (the label of a Button)
  ┌──────────────────────────┐       ┌──────────────────────────┐
  │ half-leading             │       │ line                     │
  │ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │       │ pad-md                   │
  │ Cap height to baseline   │       │ Cap height to baseline   │
  │ ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ │       │ pad-md                   │
  │ half-leading             │       │ line                     │
  └──────────────────────────┘       └──────────────────────────┘
```

- Inside a control. A component that declares its height (a
  [Button](components/button.md), a [ListItem](components/list-item.md), a
  [Toolbar](components/toolbar.md), a [Badge](components/badge.md), a
  [Pair](components/pair.md)) trims its text on both sides. Its height is
  then the ink, its padding and its lines, and nothing else.
- Where a text edge meets a container edge or a line. The first line of
  text in a container with padding is trimmed at the top and the last one
  at the bottom; a line of text right above or below a line is trimmed on
  that side. The distance from the edge to the ink is then exactly the
  padding, or the same above and below the line. This holds for every
  line of text, whichever component draws it. A component without a line
  or a surface of its own passes the edge on to what it holds, and the
  things it places side by side are all at that edge. The line that is
  trimmed is marked on the element that holds the line (`data-ink`),
  never on a wrapper that bundles lines, which only passes the edge on. A
  [Row](components/row.md) at an edge trims all of its text, so that its
  items stay level: each of its items that passes the edge on (a
  [Stack](components/stack.md), a wrapper, another row) is at the row's
  edges, whatever its place in the row. [Stats](components/stats.md)
  passes the edge to every [Stat](components/stat.md) in the same way,
  and a [Pair](components/pair.md) to its name and its value.
- Where text aligns to a column. The cells of a
  [Table](components/table.md) and the names and values of a
  [Tcard](components/tcard.md) are trimmed, so that the columns line up by
  their ink.

Everywhere else, text keeps its line box. Two paragraphs in a
[Stack](components/stack.md) are apart by the gap plus their leading,
which is how reading text should breathe.

The ink is `--kata-ink` times the font size: the cap height (0.698 of the
em) and nothing more for Latin text. When the root element's language is
Chinese, Japanese or Korean, the ink also reaches the top and the bottom of
CJK characters, and the trim adds that part back as padding, so a control
is a little taller and no character is cut. Japanese text breaks its lines
by the strict rules, and breaks inside a word only when the word does not
fit on a line by itself: the least width the text needs is still its
longest word, so a component that measures its content takes its narrower
form instead of breaking a word.

The descenders still reach below the trimmed box, so trimmed text never
clips its vertical overflow: a trimmed line that ends in an ellipsis is
clipped sideways only.

## A mark beside text

A mark is a box of its own. Outside a sentence it is laid out as a
block, never as a glyph on a line of text, so a container that holds it
alone is as tall as the mark: a [Swatch](components/swatch.md), an
[Avatar](components/avatar.md), a [Badge](components/badge.md) and the
dots of a [Spinner](components/spinner.md). A [Kbd](components/kbd.md)
inside a sentence stays on its line.

A mark beside text that may wrap (an icon, a switch, a badge) is centred
on the ink of the text's first line. It sits in a seat whose baseline is
that of a trimmed line centred in it, and the layout aligns by first
baseline. A seat of no height hangs the mark without making the line
taller.

```text
  seat (height of the mark)          the text beside it
  ┌──────────┐
  │          │                       Cap height to baseline of the
  │   mark   │ ─ ─ centre of ─ ─ ─   first line, wherever the text
  │          │     the ink           wraps
  └──────────┘                       second line
```

The seat is the `seat` mixin of the components' styles, and its font size
is that of the text beside it. The ink is the one of the root's language,
so with a Japanese root the mark is centred on the CJK ink, not on the
cap height. Wherever the text wraps and wherever it is trimmed, the mark
stays on its first line: a [Toggle](components/toggle.md), a
[Banner](components/banner.md), a [Note](components/note.md), a
[Markbox](components/markbox.md) in a [Row](components/row.md) with
`align="first"`, the summary of a folded part in
[Prose](components/prose.md), and the end of a [Text](components/text.md).
The end of a Text moves to a line of its own when the text cannot keep
four of its characters beside it, and there its seat has the height of
its mark.

A mark beside a line of text that does not wrap sits in a seat too, so
the first baseline of the row is the text's, not the bottom of the
mark. A layout that aligns by first baseline (a `top`
[Pair](components/pair.md), the action of a Banner, a Row with
`align="first"`, a sentence) then places the row by its text: the + of
the add action of an [InlineEdit](components/inline-edit.md), the icons
of a [LinkAction](components/link-action.md), and the leading icon or
the mark of a [Button](components/button.md). Where the text keeps its
line box, the seat and the text are a line that aligns by baseline,
centred in the control.

## Padding and gaps

Every distance is one of two scales, and each property takes only one.

| Scale | Tokens | Unit | Used for |
| --- | --- | --- | --- |
| pad | `--kata-pad-<step>` | em | `padding`: an edge to what is inside |
| gap | `--kata-gap-<step>` | rem | `gap`: between things; a page's margin |

Padding is in em, so it is measured against the component's own text: a
component with larger text gets more room around it. Gaps are in rem, so
they are measured against the root: a layout has no text of its own, and
its gaps stay the same however deeply it is nested. The steps are the
seven sizes of the [scale](scale.md), from 2xs to 2xl.

```text
  ┌─ Block (a container with padding) ───────────────┐
  │   pad-md                                          │
  │ ┌───────────────────────────────────────────────┐ │
  │ │ Name                        (trimmed at top)  │ │
  │ └───────────────────────────────────────────────┘ │
  │   gap-sm   (Stack gap="sm")                       │
  │ ┌───────────────────────────────────────────────┐ │
  │ │ [ Text input                                ] │ │
  │ └───────────────────────────────────────────────┘ │
  │   pad-md                                          │
  └───────────────────────────────────────────────────┘
```

Components have no outer margin: the distance between two components is
the gap of the layout that holds them, and the distance to an edge is the
padding of the container. [Prose](components/prose.md) is the one
exception, where headings and paragraphs keep the margins of reading text.

## Heights

A height is a sum, never a number chosen by eye.

| Height | Sum |
| --- | --- |
| button | ink + pad-md × 2 + line × 2 |
| small button | ink + pad-sm × 2 + line × 2 |
| list item | ink + pad-md × 2 |
| toolbar | small button + pad-md × 2 |
| footer | button + pad-md × 2 |

At the default root of 16px, a button is 16 × (0.698 + 2) + 2 = 45.2px. A
container that holds controls declares their height, and the controls
read it: a list item and a toolbar hold small buttons, a footer holds
buttons. [Tokens](tokens.md#heights) lists every height.

## Lines

A line is as far from what is above it as from what is below it, and two
lines never run along one edge. A line that runs along one side of a
component only is an edge on that side only: seen from the other side,
the distance runs to what is inside it, such as the text of the tabs that
have a line along their bottom.

## The three widths

Layouts change at three widths of the window, measured in rem: tiny below
24rem, narrow below 48rem and mid below 64rem. Because they are in rem, a
larger text size makes the same window count as narrower, and the layout
folds before anything is squeezed. [Layout](layout.md) says what changes at
each width.
