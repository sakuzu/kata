# Layout

A screen in kata is built from containers, which hold padding, and
layouts, which hold the distances between things. This chapter describes
both, the three widths at which a layout changes, and how a page is put
together. [Measuring](measuring.md) says where each distance starts and
ends.

## Containers

A container is either with padding or without, and it never decides this
by looking at what it holds.

- With padding: pad-md on every side, and the first and last lines of
  text trimmed at its edges. [Block](components/block.md),
  [Card](components/card.md) and the body of a
  [Modal](components/modal.md) are containers with padding. They hold
  text, fields and actions.
- Without padding: the items reach the edges and bring their own padding
  at the sides. The content of a [Panel](components/panel.md), a
  [Menu](components/menu.md) and a [Drawer](components/drawer.md) are
  containers without padding, and so are a
  [Popover](components/popover.md), a [Board](components/board.md) and a
  [Confirm](components/confirm.md) with `flush`, and the detail of a
  [SourcePicker](workbench/source-picker.md) with `flush`. They hold
  lists, trees, tables and section headers, stacked with gap 0; text and
  fields go in a Block inside them.

A container with padding never sits directly in another one without a
line or a surface between them: a Block inside a Block would add the two
paddings. Put the content straight in the outer one.

An item that keeps its own padding above and below (a ListItem, a
Comment, a TreeRow) sits in a container without padding, where its
padding is the distance to the edge; a container with padding never holds
one directly.

## Stacks and rows

Four layouts place things. None of them has a line, a surface or padding.

| Layout | Places | Chosen by |
| --- | --- | --- |
| [Stack](components/stack.md) | top to bottom | `gap`, always written |
| [Row](components/row.md) | side by side | `gap` (sm), `wrap`, `between` |
| [Grid](components/grid.md) | in 2, 3 or 4 columns | `cols`, `gap` |
| [Split](components/split.md) | a side column and a main one | `width` |

A Grid gives the cells of a row one height. A container in a cell keeps
its padding at the top, and the room left goes below its content.

In a Row, text shrinks and wraps within its own width while icons, marks
and controls keep theirs; a row of controls that may not fit takes `wrap`
and moves whole items to the next line. A mark beside text that may wrap
sits in a [Markbox](components/markbox.md) in a Row with `align="first"`,
which keeps it on the first line.

## Gaps

The gap says how the things are related. Choose it from the relation, not
from how the screen looks.

| Gap | In a Stack | In a Row |
| --- | --- | --- |
| 0 | sections | icon buttons without a border |
| 2xs | inside components | an icon and its text |
| xs | inside components | |
| sm | the things of one group; a title and its caption | controls |
| md | different things | |
| lg | topics, and a page's head to its content | groups of controls |
| xl | the sections of a long page | |

A title and its caption are gap sm apart, both lines trimmed.

Controls stacked directly are at least md apart, so that their outlines
do not read as one.

## The three widths

Layouts change at three widths, measured against the body in rem, so a
larger text size counts as a narrower window. Inside a
[Shell](workbench/shell.md) they are measured against the shell, which
is the size container `app` of everything in it. Nothing scrolls sideways
and nothing is squeezed; things fold instead.

Below 64rem (mid):

- A Grid of 3 or 4 columns has 2.
- The side regions of a [Shell](workbench/shell.md) with
  `side="beside"` float over the stage instead of standing beside it. By
  default they float over the stage at every width from 48rem.

Below 48rem (narrow):

- A Grid has 1 column, and a Split puts its side column above the main
  one.
- A Page's margin at the sides is gap-md.
- A Modal fills the screen and its actions move into the head; a Footer
  stacks its buttons at full width, primary first.
- A [SettingsRow](workbench/settings-row.md) puts its control under its
  text.
- A [SourcePicker](workbench/source-picker.md) turns its places into Tabs
  above the detail.
- The Shell's side regions become sheets from the bottom, and a submenu
  opens in place of its menu.

Below 24rem (tiny):

- A name sits above its value in a Pair and a Kv.
- The actions of a tree row float over the end of its name.

Some bars fold by their own width instead of the window's: when the
[Tabs](components/tabs.md) or the tools of a
[Drawbar](components/drawbar.md) do not fit, as many as fit show and the
rest move into a More menu at the end. The current tab and the current
tool always show. [Crumbs](components/crumbs.md) that do not fit with
each place at 4rem show only the current place, and nothing when even
that does not fit.

In script, `createNarrow` and `WIDTHS` measure the window in the same way,
and the shell inside a Shell
([Helpers](components/README.md#helpers)).

## Regions that scroll

A region that scrolls shows its scrollbar at all times, on both axes,
drawn in kata's colors, so that a list cut at the edge of its region
still says that more follows. A scrollbar is never hidden.

- The base CSS draws the scrollbar of every element inside the body:
  the track is size-sm thick and transparent, without arrows and with
  square ends; the thumb is `thumb`, size-xs thick in the middle of the
  track, and fills the track in `thumb-hover` under the pointer. The
  thumb reaches 3:1 on the ground and the panel.
- The page's own scrollbar is the system's.
- The scrollbar of a kata region is the component's, and holds in an
  embed too. Embedded in a page you do not own, without the base CSS
  ([Embedding kata](#embedding-kata-in-a-page-you-do-not-own)), the
  shared rules of the components (`components.css`, which
  `@sakuzu/kata/svelte` imports) draw the same scrollbar for every
  element under the root, and nothing of the page's own. A page that sets
  `scrollbar-color` or `scrollbar-width` would switch it off in Chromium,
  so the root and its children set both back to `auto`.
- No room is kept for a scrollbar: when a region overflows, its content
  narrows by the scrollbar.
- A scrollbar never squeezes a control. Where a region's width or height
  is set by its controls, the scrollbar adds to it: the column of a
  [Drawbar](components/drawbar.md) grows wider by its scrollbar, and a
  [Pager](components/pager.md), a [Table](components/table.md), a
  [Segmented](components/segmented.md) or a [Bulk](components/bulk.md)
  that scrolls sideways grows taller.
- Firefox takes the thin scrollbar of the system in the thumb's color;
  on macOS it follows the system's setting and may hide it.

## Embedding kata in a page you do not own

kata usually owns the page: the tokens are defined on `:root`, the base
CSS styles `html` and `body`, and tooltips are appended to the body. When
kata is a part of someone else's page instead, such as a panel over a
map, it lives under one root element of its own.

- Mark the root element with `data-kata-root`, and give it a `lang`.
  Tooltips, the full text of clipped lines and the probes that measure
  tokens are appended to the nearest such root instead of the body, so
  the tokens, the language and the theme still apply to them
  (`hostOf(el)` finds it).
- Scope the tokens to the root: rewrite `:root` in `tokens.css` to the
  root's selector (`.app-root`, say).
- Skip `base.css`: it styles the whole page. Set the font and the text
  color on the root yourself.
- The scrollbars of kata's regions are the components' and hold in an
  embed too ([Regions that scroll](#regions-that-scroll)).
- Put a [Shell](workbench/shell.md) inside the root. The shell is the
  size container of the three widths and measures its own element, so it
  follows the width of the root, not of the window. Over a drawing
  surface that belongs to the page, use `Shell overlay`: the shell lets
  the pointer through everywhere but its regions. From 48rem its side
  regions float over the surface (or stand beside it from 64rem with
  `side="beside"`), and below 48rem they are sheets; in each mode only
  the panes and the sheets take the pointer, not the area around them.
- Components outside a Shell still measure the window. To give them the
  root's width, declare `container: app / inline-size` on the root,
  which then needs a width that does not depend on its content.
- Do not set `contain: layout`, a `transform` or a `filter` on the root:
  each makes it the frame of fixed elements, and the tooltips, menus and
  popovers inside would no longer place themselves against the window.

```html
<div class="app-root" data-kata-root lang="en">
  <!-- a Shell with overlay, mounted here -->
</div>
```

## A page

A page is a [Page](components/page.md) with a
[PageHeader](components/page-header.md) as its head and the content
below it.

```svelte
<Page width="settings">
  {#snippet head()}
    <PageHeader title="General" note="These settings apply to the team." />
  {/snippet}
  <Stack gap={0}>
    <Section title="Profile">
      <Field label="Name" for="name"><TextInput id="name" /></Field>
    </Section>
    <Section title="Members" gap="md" flush>
      <List>…</List>
    </Section>
  </Stack>
</Page>
```

- The Page's margin is gap-lg. From the bottom of its head to the first
  visible thing of the content is pad-lg; with `flush`, when the content
  starts with a list, a tree, a table or tabs, the first item's own
  padding makes up the rest.
- The PageHeader holds an optional trail of links, the title and a note.
  Actions do not go in the head; they start the content.
- [Section](components/section.md)s divide the content. They are stacked
  with gap 0 and own the breaks between them: each one after the first
  draws a line above itself. The head of a section is gap-lg from its
  content.
- A [Block](components/block.md) holds text and fields where the
  container around them has no padding, such as a panel.
- A [Footer](components/footer.md) ends a modal or a panel: a line, then
  the actions in a fixed order, the primary one last.

A settings page has its own frame, [SettingsPage](components/settings-page.md),
which adds the trail, the title and the tabs. The
[patterns](patterns/README.md) show these pieces put together.
