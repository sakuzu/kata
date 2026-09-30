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
  containers without padding. They hold lists, trees, tables and section
  headers, stacked with gap 0; text and fields go in a Block inside
  them.

A container with padding never sits directly in another one without a
line or a surface between them: a Block inside a Block would add the two
paddings. Put the content straight in the outer one.

## Stacks and rows

Four layouts place things. None of them has a line, a surface or padding.

| Layout | Places | Chosen by |
| --- | --- | --- |
| [Stack](components/stack.md) | top to bottom | `gap`, always written |
| [Row](components/row.md) | side by side | `gap` (sm), `wrap`, `between` |
| [Grid](components/grid.md) | in 2, 3 or 4 columns | `cols`, `gap` |
| [Split](components/split.md) | a side column and a main one | `width` |

In a Row, text shrinks and wraps within its own width while icons, marks
and controls keep theirs; a row of controls that may not fit takes `wrap`
and moves whole items to the next line.

## Gaps

The gap says how the things are related. Choose it from the relation, not
from how the screen looks.

| Gap | In a Stack | In a Row |
| --- | --- | --- |
| 0 | a title and its caption; sections | icon buttons without a border |
| 2xs | inside components | an icon and its text |
| xs | inside components | |
| sm | the things of one group | controls |
| md | different things | |
| lg | topics, and a page's head to its content | groups of controls |
| xl | the sections of a long page | |

Controls stacked directly are at least md apart, so that their outlines
do not read as one.

## The three widths

Layouts change at three widths, measured against the body in rem, so a
larger text size counts as a narrower window. Nothing scrolls sideways
and nothing is squeezed; things fold instead.

Below 64rem (mid):

- A Grid of 3 or 4 columns has 2.
- The side regions of the [Shell](workbench/shell.md) float over the
  stage instead of standing beside it.

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
- The Topbar hides the brand.
- The actions of a tree row float over the end of its name.

Some bars fold by their own width instead of the window's: when the
[Tabs](components/tabs.md) or the tools of a
[Drawbar](components/drawbar.md) do not fit, as many as fit show and the
rest move into a More menu at the end. The current tab and the current
tool always show.

In script, `createNarrow` and `WIDTHS` measure the window in the same way
([Helpers](components/README.md#helpers)).

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
