# Changelog

All notable changes to `@sakuzu/kata` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
follows semantic versioning.

## [Unreleased]

## [1.10.0] - 2026-10-07

Containers that hold lists can drop their padding, so that an item that
keeps its own padding above and below (a ListItem, a Comment, a TreeRow)
never sits inside another padding (the rule of 1.9.0, #78). Nothing
changes for existing callers.

- Added: `flush` on Popover (passed to its Bubble), Board (the padding
  goes, the surface and the line stay), Confirm (passed to its Modal)
  and SourcePicker (the detail is not wrapped in a Block). The content
  reaches the edges and stacks with gap 0; text and fields go in a
  Block, lists go in directly.
- Added: `status` and `note` on SectionHeader, with the meaning they
  have in Section. The status sits on the right of the name and is not
  shown with `actions`; the note is one sentence gap-xs under the name
  and is part of the head.
- Changed: the head-near check measures the distance to the content
  from the head's last ink, the note's when the head has one.

## [1.9.3] - 2026-10-04

- Fixed: a Row that centres its items centres them on their ink. At
  either edge its lines of text are trimmed at both ends, away from the
  edges at neither, so a text action beside a Button sits on the
  button's ink (it was trimmed at one end and 3px off). Stacks (a Block
  of lines, Stats, a Pair) keep their trim at the edge side only (#76).

## [1.9.2] - 2026-10-04

A mark before a line of text sits in a seat (#74).

- Fixed: the icon of InlineEdit's add row, of LinkAction (and its
  external arrow), of a Button's leading icon and mark, and of a Toast
  sits in a seat, so the row's first baseline is the text's: a Pair
  `top` name lines up with an empty InlineEdit, and a Toast whose text
  wraps keeps its icon on the first line.

## [1.9.1] - 2026-10-04

Two gaps of 1.9.0 found by an application (#72).

- Fixed: a `reach` control collapses only its block size; its inline
  size stays the control's (an icon button keeps its square width, a
  text button its inline padding), so the hover surface is the button's
  width. A line never cuts a reach: a reach control directly inside a
  component with a line or a surface (a Floating used as a bar) is laid
  out at its reach, so the component holds the whole hit area. In
  browsers without container style queries (Firefox before 151) such a
  reach is drawn across the line; pressing and hover are kept.
- Fixed: Toolbar `two` declares its padding as an inset, so its first
  and last lines are trimmed at its edges (the head is 12.61 lower).
- Fixed: Pair `top` aligns its name with the first baseline of its
  value, and passes the edge to the name and the value side by side, so
  with an InlineEdit at rest both are md from the edge.
- Checks: the `height` check measures a reach control by its reach.

## [1.9.0] - 2026-10-04

The edges of a container, measured from what is seen (#59): text that a
component draws, a control without a line or a surface, a mark outside
a sentence, and the audit's new `edge` check. The principle for
controls without a line or a surface changes.

- Changed: principle 3. A control without a line or a surface (an
  InlineEdit at rest, a text action, a ghost button without a pressed
  state) is laid out as what it shows, its text or its icon, and draws
  its hit area, hover surface and focus ring as one shape of the
  control's height, centred on it, that takes no room (the `reach`
  mixin). Stacked fields are as far apart as text, a field at an edge
  is pad from it, and an InlineEdit grows when it enters editing. A row
  with a ghost button is as tall as its text (#59, #63).
- Changed: every line of text is trimmed at an edge, whichever
  component draws it. A line carries `data-ink`; a component without a
  line or a surface passes the edge on, and only `[data-h]`,
  `[data-inset]` and `[data-outline]` (a component with a line or a
  surface) stop it. `data-pass` is gone. An application's own element
  that relied on a `data-role` for the trim takes `data-ink` (#59).
- Changed: an icon's edge is the square it is drawn in, so a one-line
  Banner or Toast is 50.0 tall instead of 59.88 (#59).
- Changed: a mark outside a sentence (Swatch, Avatar, Badge, Spinner's
  seat) is laid out as a box, so a container holding it alone is as tall
  as the mark (#59).
- Added: `Banner body`, a snippet for content of several lines; the
  children of a Banner are one line of text. A Banner that held a Stack
  in its children moves it to `body` (#59).
- Changed: an item with its own padding above and below (a ListItem, a
  Comment) sits in a container without padding; ShortcutsModal is
  flush, and Comment no longer reserves an icon button's height (#59).
- Fixed: a Japanese Note at the edge of a Block is as far from it as
  other text (#59).
- Checks: the `edge` check (the first and last visible things of a
  container with padding sit exactly pad from its inner edge) runs on
  every example; the audit counts an icon as a visible thing, a chosen
  cell by its box, a scrollbar by its outside, and measures a `reach`
  control by its shape. The lint allows a pseudo-element moved by a
  negative translate only inside `reach` (#59).

## [1.8.1] - 2026-10-04

A fix found by an application. Nothing changes incompatibly.

- Fixed: a component that takes `--kata-inset` as its padding (ListItem,
  Comment, LayerTree's subrows, Pair, AttributeList, Toggle, Checkbox)
  declares `--kata-inset: 0px` on its children, so a Toggle or a
  Checkbox in a ListItem inside a Panel no longer takes the inset twice
  and starts at the column of the plain rows' names (#68).

## [1.8.0] - 2026-10-03

What the standard UI of a map editor needed from 1.7.0: scrollbars in
an embed, a pressable row that can be disabled, a Slider disabled
without hue, and two fixes to 1.7.0's folding. Nothing changes
incompatibly.

- Added: `ListItem disabled`. A pressable row (`onclick`) that is
  disabled is dimmed, takes no hover, is not pressed by a click or a
  key, has `aria-disabled="true"` and leaves the tab order, as a
  disabled Button (#64).
- Fixed: the scrollbars of kata's regions reach an embed. The rule of
  "Regions that scroll" also lives in the components' styles for the
  elements under `[data-kata-root]`, so a panel in an embed shows that
  it scrolls; the root resets an inherited `scrollbar-color` and
  `scrollbar-width`, which would switch the styling off in Chromium. A
  full page keeps the rule of the base styles, and the host's own
  regions are not touched (#62).
- Fixed: a disabled Slider takes `solid-disabled` for the part it has
  passed and the filled shape's disabled colors for its thumb, instead
  of its blue dimmed (#65).
- Changed: a title with an `end` keeps at least min(its own width, 4em)
  beside the end; when it cannot, the end moves to a line of its own
  under the title and its seat takes the height of its mark, instead of
  the title being squeezed below its words (#66).
- Fixed: Crumbs measure the chevron after the last place with its
  gap-2xs, so a trail with room to spare ends no place with an ellipsis
  (#48).
- Checks: the audit reads the tokens from the nearest `[data-kata-root]`,
  so an embedded example is measured; a new example, embed.

## [1.7.0] - 2026-10-03

Fixes and rules found in an application's review: a mark beside text
that wraps, the surface under a cover, disabled without hue, narrow
widths that fold instead of squeezing, and scrollbars that are always
visible. Nothing is removed; a few looks change (listed as Changed).

- Added: the rule for a mark beside text that may wrap (measuring.md)
  and the `seat` mixin: the mark is centred on the ink of the first
  line. Note, Banner, Toggle, Markbox and the summary of Prose use it,
  so a Note's icon and a Prose chevron stay on the first line (#40,
  #37).
- Added: `Row align="first"`, which aligns its items by the first
  baseline, so a mark in a Markbox stays on the first line of text that
  wraps (#36).
- Added: `Text end`, a mark (a Badge, a button) beside a title that
  hangs without making the line taller; PageHeader puts its side there
  with the same API (#29).
- Added: the context token `--kata-color-surface`, the opaque surface an
  element sits on, and the `surface` mixin. A sticky column, a fill
  head, the end of a TreeRow and the rings of Counter, Presence and
  ColorGrid paint it, so they match the surface they cover (#55).
- Added: `--kata-color-thumb` and `--kata-color-thumb-hover`, and the
  rule "Regions that scroll" (layout.md): a region that scrolls shows a
  thin scrollbar at all times, on both axes, in kata's colors, and the
  scrollbar adds to a region sized by its controls instead of squeezing
  them. Firefox follows the operating system (#33, #42, #52).
- Added: `lib/place.ts`: a Dropdown, a Select and a MenuList follow
  their trigger while open, and keep gap-xs from it and gap-md from the
  window's edge, read from the tokens (#50).
- Added: the checks `first-line`, `near`, `scroll-mark` and `thumb`.
- Changed: disabled is the same shape without hue. A filled shape
  (primary, danger-fill, Fab, a chosen Toggle, Checkbox or Radio,
  Segmented's chosen option) takes `solid-disabled` and
  `solid-disabled-text`, now the fill's grey with the text as dim as a
  disabled outline's, in both palettes (light was a pale blue, and the
  text of a disabled primary read as pressable); a busy button takes
  the same; a
  danger button disabled takes the text and line of an outline; a
  disabled or busy button takes no hover (#38, #57).
- Changed: Crumbs fold by their own width (every place, the current
  place, none) instead of being squeezed to fragments in a narrow
  Topbar; the brand ellipsizes only after the crumbs are gone (#48).
- Changed: in Japanese, a long string breaks only when it does not fit
  (`overflow-wrap: break-word`), so a Latin word keeps its width and a
  StepBar switches to its numbers form (#49).
- Changed: Segmented no longer hides its scrollbar. Table and Bulk no
  longer draw the inset line at an edge that has more; `overflowEdges`
  and the `overflow-edges` mixin stay exported, are used by no
  component, and will be removed in the next major (#42, #52).
- Changed: a Glyphs cell is at most a square, in a band and in the grid
  alike (#43).
- Fixed: a resting side sheet is not shown while the dock's sheet is
  open in a narrow Shell (#35).
- Fixed: Pager keeps the size of its squares and switches to the
  compact form when the full one does not fit (#51).
- Fixed: Actions wrap the buttons inside a group wider than the frame
  (#58).
- Fixed: NativeSelect shows its placeholder when there is no value
  (#45).
- Fixed: the subrows of a LayerTree row start at the column of its name
  (#39).
- Fixed: a Chip without a remove button has pad-sm on both sides (#44).
- Fixed: the description of a Radio is nearer its own label than the
  next one (#46).
- Fixed: a Stat at the edge of a container trims its lines, through
  Stats and the items of a Row (#53).
- Docs: Panel draws no edge; the container that docks it draws the line
  (#54). Notices bring no space below; the content after them does
  (#41). The examples of small inputs, the shell's modes and col-head's
  merged column are corrected (#47).

## [1.6.2] - 2026-10-02

Fixes found in an application's review. Nothing changes incompatibly.

- Fixed: a Sheet with `pane` at half scrolls the panel's content and
  keeps its foot in view, through a wrapper of the application as tall
  as its place too; a drag that ends above the height it started from
  never snaps to a lower stage (nor one below it to a higher one), and
  the click that ends a drag no longer steps (#56).
- Fixed: headings and short text wrap as they come instead of balancing
  their lines, which narrowed a Japanese caption and split the words of
  a heading; body and prose keep `pretty` (#32).

## [1.6.1] - 2026-10-02

Fixes found in an application's review. Nothing changes incompatibly.

- Fixed: a menu opened from the actions of a TreeRow keeps them shown
  while the pointer moves into it: a Dropdown (and so a Kebab and a
  Popover) dispatches a bubbling `kata-menu-toggle` event with
  `detail: { open }` from its trigger, and the row has `data-open` while
  a menu of its own is open (#31).
- Fixed: a Stat at an edge (the padding of a container, or a line) trims
  the top of its figure and the bottom of its name, as Text does, so a
  line is as far from its ink as from the text on the other side (#28).
- Fixed: the centre of a Topbar is clipped at its sides only, so the
  focus ring of a button there stays whole (#30).

## [1.6.0] - 2026-10-02

What the panels and the frame of an editor need around a selection, a
picker and the stage: a foot for a selection's panel, a bare Board,
Glyphs with its own columns, and the inset of the stage from a Shell;
and the folding, the marks and the spacing found in the editor.

- Added: `SelectionSummary foot`, the foot of the panel (a Footer), as
  the `end` of an InspectorFrame.
- Changed: a destructive action goes in the lead of an inspector's foot
  (Delete), never among the actions at the end of a Footer; elsewhere it
  is the primary action of a confirmation.
- Added: `Board bare`, which keeps only the padding, for a slot that
  draws the surface and the line, as `ColorPicker bare`.
- Added: `Glyphs columns` (8 by default). In a row a cell is as wide as a
  column of the grid, so that a band above a grid lines up with it.
- Added: `ShellLayout inset`, `{ top, right, bottom, left }` in px: from
  each edge of the stage to the inner edge of the region on that side
  (an open side region beside the stage, a floating pane and the gap-md
  before it, the sheets, the floating bar). `onlayout` is called when
  the inset changes too, and the root sets `--kata-shell-inset-top`,
  `-right`, `-bottom` and `-left`.
- Changed: the sort key of a ColHead is marked with an arrow
  (`arrow-down`, a new icon) instead of a chevron, apart from the ▾ of
  the column menu.
- Changed: the content of a flush SectionHeader without an action starts
  gap-xs below the ink of the name; the audit's `head-gap` and
  `head-near` allow that gap.
- Fixed: the button beside the title of a PageHeader (`titleEnd`) no
  longer raises the title's line; it overlaps the centre of the title,
  as the action of a SectionHeader does.
- Changed: a Crumbs with `current={false}` follows its last place with a
  chevron and gap-2xs, so the title after it needs no separator of its
  own; an application that added one removes it.
- Added: `Radio note`, a caption under the label in the column of the
  text (a snippet).
- Added: in Prose, the anchor of a heading
  (`a[data-role="heading-anchor"]`) shows only while the heading is
  hovered or holds the focus.
- Changed: Tabs that do not fit are taken from the start in their order,
  and a folded current tab shows its name and its mark on the trigger of
  the menu instead of "More".
- Changed: a LinkAction in a sentence (inside a Text) takes the size and
  the line height of the text around it.

## [1.5.1] - 2026-10-02

The narrow screen, from the visual review: what stacks, folds and opens
when the room is short. Nothing changes incompatibly.

- Fixed: a Footer stacks only when its row does not fit, measured, instead
  of always below 48rem, and every stacked part takes the full width (#3).
- Fixed: the toolbar's column above the Fab of a narrow Shell starts below
  the floating bar (`--kata-shell-top`) and scrolls when it does not fit
  (#4).
- Fixed: a Topbar never hides its brand; when the row does not fit it
  passes `{ compact }` to `presence`, then to `end`, and the brand ends
  with an ellipsis last (#5).
- Changed: a narrow Shell opens one of the side sheets and the dock at a
  time, and puts the dock in a sheet without `dockSheet` too, named by the
  new `dock` message (#6).
- Changed: the `half` stage of a Sheet is the content's height up to half
  the frame (#7).
- Fixed: an input and a select show an ellipsis when their text does not
  fit (a NativeSelect draws its label over a transparent select, so WebKit
  shows it too), and the centre of a Topbar is clipped and receives
  `{ compact }` as a third step, to fold a search into an icon button
  (#9).
- Fixed: a Floating stays inside its frame: pinned, no wider than the
  frame less its sides; in the flow, its content wraps (#12).
- Fixed: the Drawbar, the sheets of a Shell and the measured widths read a
  change of size in the next frame, which ends the ResizeObserver loop
  error on WebKit (#25).
- Fixed: a dropdown or a popover opened from inside a toolbar opens from
  the bar's edge instead of covering its line; from a vertical bar (a
  Drawbar standing in a column) it opens beside the bar, on the left, or
  on the right when there is no room, lined up with the trigger (#26).
- Fixed: trimmed single-line text clips sideways only, so WebKit keeps the
  descenders; the audit's `trim-clip` check follows (#1).
- Changed: a title and its caption in a two-line item are gap-sm apart,
  both lines trimmed (the examples, MenuItem and Select follow) (#2).
- Fixed: a NumberInput removes the spin buttons, which took room even
  where they were invisible, and takes `digits` (a FieldSpec too) to size
  itself to its value (#11).
- Fixed: the action of a Banner sits on the baseline of its first line
  (#19).
- Added: the audit checks `tabs-gap` (the content under Tabs on a page is
  gap-lg away) and `bundle-edge` in a bare Surface; the examples follow
  (#20, #21).
- Changed: the summary of a details in Prose is body text at the label
  weight after a chevron (#22).
- Fixed: a mark in the value of a Pair keeps its own size (#23).
- Added: `text-wrap-style`: pretty for body and prose, balance for the
  other roles (#24).
- Changed: a Table keeps only its first column sticky; a Table and a Bulk
  show that they scroll sideways with a line at the edge (`overflowEdges`,
  exported); the narrow Tcard sets its name and value gap-xs apart (#10).
- Fixed: in the dark palette a black swatch has an edge, the over-limit
  Meter uses the red fill, and a disabled primary button uses the new
  `solid-disabled` tokens (#13).
- Changed: the mono font stack no longer names IBM Plex Mono; an
  application that loads it puts it first (#14).
- Fixed: the hover-only actions of a TreeRow keep no place; only the
  `data-keep` ones do (#15).
- Fixed: a flush SectionHeader with actions keeps pad-md above its body,
  the subrows of a LayerTree indent to the name, and the grip of a
  depth-0 row sits inside the focus ring (#16).
- Fixed: the actions of Actions wrap as one group; a Pager stays on one
  line, compact (first, current, last) when it does not fit, and scrolls
  after that (#17).
- Fixed: a StepBar shrinks its connectors first, then stacks the names
  under the numbers, then shows the numbers only with the current name
  under the bar (#18).
- Fixed: the examples of the menus, kbd, row and settings-row sit in a
  frame of their width; the panel fit case, versions-panel at 390 and
  bulk follow (#27).

## [1.5.0] - 2026-10-02

What the frame of an editor needs from the Shell on a narrow screen and
around it: the narrow form forced at any width, the stages of each
side's sheet and whether it closes, a control that opens a closed side
again, the toolbar folded into a Fab as a column, the dock as a sheet,
the bar floating over the stage; and a Crumbs whose last item is not the
current place. Nothing changes incompatibly.

- Added: `Shell narrow`, which gives the shell the narrow form at any
  width (`true`) or never (`false`), for a short window or a small frame.
  `onlayout` reports the width it decides. Without it, the width decides
  as before.
- Added: `Shell leftSheet` and `rightSheet` (`ShellSheet`), the heights
  each side's sheet offers and whether it closes on a narrow screen. A
  sheet with `closable: false` stays at its lowest height while its
  region is not open, and raising it opens the region. `Shell leftStage`
  and `rightStage` (bindable) are the height of each sheet while open.
  The type `SheetStage` is exported.
- Added: `Shell leftReopen` and `rightReopen` (`ShellReopen`), a ghost
  icon button in the corner of the stage that opens a closed side region
  again, from 48rem.
- Added: `Shell bottomFab` (`ShellFab`): on a narrow screen the toolbar
  folds into a Fab gap-md above the sheets, and shows in one column above
  it while the Fab is pressed. The `bottom` snippet receives
  `{ column }`, which says to stand the toolbar in one column; a snippet
  without the argument keeps working.
- Added: `Drawbar column`, the tools in one column in the flow of their
  container, the groups gap-md apart, with nothing folded into More.
- Added: `Shell dockSheet` (`ShellDockSheet`): on a narrow screen the
  dock is a closable Sheet instead of the area under the stage, and
  `Shell ondockclose` is called when it closes. The toolbar rises above
  it as above the other sheets.
- Added: `Shell topFloating`: on a narrow screen the bar at the top
  floats over the stage in a Floating, gap-md from the top and the sides,
  and the stage fills the shell.
- Added: `Crumbs current`. With `false` the last place is a place like
  the others, a link or a button when it has `href` or `onclick` and
  without `aria-current`, for a trail followed by a title that is the
  current place.

## [1.4.1] - 2026-10-02

One fix to the FieldList.

- Fixed: the color button of a FieldList fills the value column, as the
  other controls of a field do, instead of taking the width of its text.

## [1.4.0] - 2026-10-02

What the layer panel, the comments and the shortcuts of an editor need
from the workbench: each row of a LayerTree can hide its eye, its lock
or its grip, refuse selection, carry a reason for a disabled eye and be
marked current; a folded CommentList; `top` for a field of several
lines; the matching of shortcut keys exported, symbols matched by their
physical key, and the order of the groups in the list of shortcuts.
Nothing changes incompatibly, except that `TreeSelectModifiers` now
carries `pressed`.

- Added: `matchesShortcut`, `matchesAnyShortcut` and `shortcutText` are
  exported, the matching and the writing of keys that a Shell uses, for
  the application's tests and its own listeners.
- Added: `ShortcutsModal groups` and `Shell groups`, the order of the
  groups in the list of shortcuts, which the Shell passes to the list it
  opens with the help key. The groups not in it follow in the order they
  first appear, as all of them do without it. The order of `shortcuts`
  stays the order in which they are matched.
- Added: `InspectorRow top` and the `top` key of a `FieldSpec`, for a
  value of several lines, such as a custom field with an input, a slider
  and actions under one another: the row is aligned at the top, as a
  Pair with `top`, and its height follows the content.
- Added: `DrawbarToggle onchange` may be left out, as for a switch with
  a `popover`, which does not call it. A switch without it does nothing
  when it is pressed, in the bar or in the More menu.
- Added: the nodes of a `LayerTree` can change their own row. `eye:
  false` and `lock: false` leave out the eye and the lock of that row;
  `draggable: false` keeps it in its place, without a grip even with
  `gripOnly`; `selectable: false` makes a press select nothing and
  leaves out its `aria-selected`, while the arrows still reach it;
  `eyeDisabled` disables the eye and shows its text in the eye's
  tooltip; `current` gives the row `aria-current="true"` and a strong
  name.
- Added: `LayerTree actionsAfter`, which puts `actions` after the eye and
  the lock, and `LayerTree subrows`, a snippet of the node drawn right
  under its row and before its children, the width of the tree and
  indented one level deeper, without a grip or a selection.
- Added: the second argument of `LayerTree onselect` has `pressed`, the
  id of the row that was pressed.
- Added: `CommentList folded`, one row for each thread: the author's
  Avatar, the body cut at two lines with a byline under it, and a
  Resolved badge on a resolved thread. Pressing the row calls `onopen`.
  `CommentThread byline` is that line as the application words it; it is
  the author's name and `when` without it.
- Added: `CommentList actions`, a snippet of the thread for the
  application's own actions, before resolve and open.
- Fixed: a `LayerTree` no longer reads the children of a closed group,
  which took time when a closed group held many nodes. The keys, the
  selection and the drops reach only the rows that show, as before.
- Fixed: a shortcut whose key is a symbol (`[`, `]`, `?`, `/`, `.`, `,`,
  `;`, `'`, `` ` ``, `\`, `-` or `=`), `plus` or `minus` also matches by
  the physical key, as letters and digits already did, so that it still
  runs when ⌥ on a Mac turns the key into another character.

## [1.3.0] - 2026-10-01

Openings that the editor of the reference application needs to put its own
content into the workbench components: a band under the head of the
InspectorFrame, the value of an InspectorSection, a popover on a Drawbar
switch, live values and an external color picker in a FieldList, and
aliases, hidden keys, display keys, digits and lone modifiers in the
shortcuts. Two fixes to the text of a Toggle and to the line of Tabs.
Nothing changes incompatibly.

- Added: `InspectorFrame underHead`, a snippet placed under the head and
  above the tabs, for a band of the application such as a palette. It
  keeps its place while the content scrolls.
- Added: `InspectorSection value`, the current value shown muted on the
  right of the head, before the actions, as a Disclosure shows it. It
  shows whether the section folds or not, and while it is closed.
- Added: `DrawbarToggle popover`, a snippet of `(close)`. Pressing such a
  switch opens a Popover with it, lined up with the switch's end and
  above the bar, instead of calling `onchange`; the switch has
  `aria-haspopup="true"` and `aria-expanded`, and `on` stays what it
  shows. `Dropdown up` and `Popover up` open above the trigger first,
  and below only when there is no room above.
- Added: `FieldList oninput`, called with the key and the value of a
  slider at each value while it is dragged (`onchange` is still called
  once, when it is let go); `FieldList oncolor`, which makes the button
  of a color field call it with the key instead of opening a ColorPicker,
  so that the application opens its own; and `FieldList end`, one row
  after the fields for an action on all of them, such as a reset.
- Added: `Shortcut aliases` (more keys that run it, not listed),
  `Shortcut hidden` (it runs but is not listed) and `Shortcut display`
  (the keys listed instead of `key`, joined with " / "). The key `digit`
  matches any of 0 to 9 and is written 0–9; a modifier alone (`alt`,
  `shift`, `mod`) matches the press of that key by itself and is written
  ⌥, ⇧ and ⌘ on a Mac and Alt, Shift and Ctrl elsewhere. `isMacPlatform`
  is exported.
- Fixed: the text of a Toggle wraps onto more lines instead of being cut
  with an ellipsis; the switch stays level with the first line. One line
  looks as before.
- Fixed: the line along the bottom of Tabs outside a Toolbar counts as a
  line. A section right after them starts pad-lg below it, as after a
  Divider, instead of pad-sm, and text right after them is trimmed to
  its ink.

## [1.2.0] - 2026-10-01

The side regions of the Shell float over the stage by default, as in the
editor of the reference application. This changes the default layout.

- Changed: from 48rem the Shell's side regions float over the stage at
  every width (`leftMode` and `rightMode` are `floating` for `wide` too).
  Each pane is a panel wide, gap-md from the top of the stage and from
  its own side, and as tall as its content up to the stage's height less
  gap-md above and below; beyond that the Panel's content scrolls. Both
  may be open at once and the stage takes the pointer around them.
- Changed: the floating panes have no scrim, and Escape no longer closes
  them: it goes to `onescape`. Escape still closes the sheet opened last
  below 48rem. The `closePanes` message is no longer shown and is
  deprecated.
- Changed: with `overlay`, the floating panes and the sheets take the
  pointer and the area of the stage around them lets it through to the
  page.
- Added: `Shell side`, `'floating'` (the default) or `'beside'`.
  `side="beside"` keeps the earlier layout from 64rem: the side regions
  stand beside the stage with a strong line between. From 48 to 64rem
  they float, without a scrim. The type is exported as `ShellSide`.

## [1.1.0] - 2026-10-01

kata can be embedded in a page it does not own, and the Shell can lie
over a drawing surface. Each entry says whether it is an addition or a
change.

- Added: embedding kata in a page it does not own. A root element marked
  `data-kata-root` is the host of what kata appends outside a component:
  Tooltip and `clampTip` put their tips into the nearest such root
  instead of the body, and the tokens they read are measured there.
  `hostOf(el)` returns that root, or the body. The Layout chapter has a
  section on embedding.
- Added: `Shell overlay`. The shell's root lets the pointer through to a
  drawing surface of the page, and only its regions (the bar, the side
  regions, the toolbar, the dock, the scrim, the floating panes, the
  sheets, the veil and the list of shortcuts) take it.
- Added: `createNarrow().start(el)` and `isNarrowerThan(rem, el)` measure
  a given element instead of the window.
- Added: the audit's `fixed-frame` rule. A Shell or an embedded root is
  never the containing block of fixed elements.
- Changed: the Shell measures its own element with a `ResizeObserver`
  (the window where there is none) instead of the window, and declares
  the size container `app` on its root, so it follows its own width when
  it is narrower than the window, and the container queries of the
  components inside it work without `base.css`. Inside a Shell,
  `createNarrow` (and so Modal, Pair, MenuList and SourcePicker) measures
  the shell. A Shell that fills the window behaves as before.
- Changed: the list of shortcuts of a Shell is rendered inside the
  shell's root.

## [1.0.0] - 2026-10-01

The first release of kata: the foundation, 110 components, 20 parts for
drawing applications, the documentation site and the checks that hold
them to the rules.

### Added

- Foundation, usable without a framework (`@sakuzu/kata`,
  `@sakuzu/kata/tokens.css` and `@sakuzu/kata/base.css`).
  - The numeric scale: one root (φ), three steps, seven sizes and eight
    type roles, generated as CSS custom properties by `npm run scale`.
  - Tokens for spacing (padding in em, gaps in rem), type, color in a
    dark and a light theme, lines, heights, widths, opacity and layers.
  - Base CSS: the reset, the text size setting (`data-font-scale`), the
    size container for the three widths and the keyboard focus ring.
- Components for Svelte 5 (`@sakuzu/kata/svelte`), each with a page and a
  live example.
  - Layout and text (19): Stack, Row, Grid, Split, Block, Section,
    SectionHeader, Divider, Indent, Page, PageHeader, Footer, Text,
    Prose, Kbd, Icon, Thumbnail, Figure and Glyphs.
  - Controls (24): buttons, switches, choices, inputs of text, numbers
    and files, fields, selects, and color pickers and palettes.
  - Data display (30): badges, tags and chips, names and values, figures
    and meters, lists, tables, cards and tiles, people and pins, and
    empty and loading states.
  - Overlay and feedback (21): modals, confirmations, drawers, sheets,
    popovers, tooltips, menus, banners and toasts, and the bar of a
    selection.
  - Structure (16): panels, toolbars, the top bar, the drawing toolbar
    (Drawbar, which folds the tools that do not fit into a More menu),
    tabs, crumbs, trees, drop targets, disclosures, the filter bar, the
    settings page frame, comments and threads, and the `sortable`
    action.
  - The messages API (`setMessages`) for the strings the components show
    on their own, the icons, and helpers for the text size, the widths,
    clipped text, toasts and keyboard shortcuts (`formatShortcut`).
  - The Sass functions and mixins the components are written with
    (`@sakuzu/kata/svelte/styles/kata.scss`), for an application's own
    styles.
- Workbench parts (20), the large parts of a drawing application, which
  know nothing of what is drawn.
  - Shell, the frame of the editor: the bar, the side regions (beside the
    stage, floating panes over it or sheets, by the width), the stage,
    the toolbar and a resizable dock, with keyboard shortcuts and
    ShortcutsModal.
  - LayerTree; the menus on one model (`MenuModel`): MenuList, AppMenu
    and MenuSheet; the inspector: InspectorFrame, InspectorSection,
    InspectorRow, FieldList (on `FieldSpec`) and AttributeList.
  - SearchPanel, VersionsPanel and SelectionSummary; ProcessDialog and
    SourcePicker; CommentList and CommentComposer; SettingsSection and
    SettingsRow.
- Documentation: the chapters Principles, Scale, Tokens, Measuring,
  Layout, Components, Workbench, Patterns (a modal with a form, a menu,
  a list with actions, a panel, a settings page and a workbench) and
  Checks, published as a site at <https://sakuzu.github.io/kata/> with a
  live example on every page (`npm run site:deploy`).
- Checks: `npm run audit` reads the components' styles and measures every
  example in a browser at three widths, two text sizes, both themes and
  two languages; `npm run check:terms` keeps the vocabulary of one kind
  of drawing out of kata; `npm run check:package` runs publint and Are
  the Types Wrong on the package.

[1.9.3]: https://github.com/sakuzu/kata/compare/v1.9.2...v1.9.3
[1.9.2]: https://github.com/sakuzu/kata/compare/v1.9.1...v1.9.2
[1.9.1]: https://github.com/sakuzu/kata/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/sakuzu/kata/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/sakuzu/kata/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/sakuzu/kata/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/sakuzu/kata/compare/v1.6.2...v1.7.0
[1.6.2]: https://github.com/sakuzu/kata/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/sakuzu/kata/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/sakuzu/kata/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/sakuzu/kata/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/sakuzu/kata/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/sakuzu/kata/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/sakuzu/kata/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/sakuzu/kata/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/sakuzu/kata/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sakuzu/kata/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sakuzu/kata/releases/tag/v1.0.0
