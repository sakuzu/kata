# Components

The components of kata are bound for Svelte 5 in `@sakuzu/kata/svelte`.
They are built on the [tokens](../tokens.md) and need the foundation's
stylesheet, which the application imports once.

```sh
npm install @sakuzu/kata svelte
```

```svelte
<script>
  import '@sakuzu/kata';
  import { Page, PageHeader, Stack, Text } from '@sakuzu/kata/svelte';
</script>

<Page>
  {#snippet head()}<PageHeader title="Documents" />{/snippet}
  <Stack gap="sm">
    <Text>Everything shared with this team.</Text>
  </Stack>
</Page>
```

Each page below describes one component: what it is, when to use it, its
props, its contract (height, padding and states) and a live example.

## Layout and text

- [Stack](stack.md), [Row](row.md), [Grid](grid.md) and [Split](split.md):
  the layouts, which hold the distances between things.
- [Block](block.md), [Section](section.md),
  [SectionHeader](section-header.md), [Divider](divider.md) and
  [Indent](indent.md): containers, groups and lines.
- [Page](page.md), [PageHeader](page-header.md) and [Footer](footer.md):
  the frame of a page and of a modal.
- [Text](text.md) and [Prose](prose.md): text in its type roles, and text
  to read.
- [Kbd](kbd.md), [Icon](icon.md), [Thumbnail](thumbnail.md),
  [Figure](figure.md) and [Glyphs](glyphs.md): small marks, pictures and
  symbols.

## Controls

- [Button](button.md), [LinkAction](link-action.md),
  [Actions](actions.md) and [Counter](counter.md): actions, a row of
  them, and a count on a button.
- [Toggle](toggle.md), [Checkbox](checkbox.md), [Radio](radio.md),
  [RadioGroup](radio-group.md), [Segmented](segmented.md) and
  [Slider](slider.md): switches, choices and a value on a range.
- [TextInput](text-input.md), [Textarea](textarea.md),
  [NumberInput](number-input.md), [SearchInput](search-input.md),
  [InlineEdit](inline-edit.md) and [FileInput](file-input.md): the inputs
  of text, numbers and files.
- [Field](field.md) and [InputGroup](input-group.md): the name and note
  of an input, and an input with its actions.
- [Select](select.md) and [NativeSelect](native-select.md): one value
  from a list.
- [ColorPicker](color-picker.md), [ColorGrid](color-grid.md),
  [Swatch](swatch.md) and [Palette](palette.md): colours and colour
  schemes.

## Data display

- [Badge](badge.md), [Tag](tag.md), [Chip](chip.md) and
  [ChipValue](chip-value.md): a state, a kind, a value that can be
  removed, and a value at a point of a canvas.
- [Pair](pair.md), [Kv](kv.md) and [ReadValue](read-value.md): names and
  values, and a value to read.
- [Stat](stat.md), [Stats](stats.md), [Meter](meter.md),
  [Progress](progress.md), [StepBar](step-bar.md) and [Bars](bars.md):
  figures, amounts, progress and a distribution.
- [List](list.md), [ListItem](list-item.md), [Table](table.md),
  [ColHead](col-head.md), [Pager](pager.md), [Tcard](tcard.md) and
  [Tcards](tcards.md): lists, tables and their pages.
- [Card](card.md), [Board](board.md), [Gtile](gtile.md),
  [Tile](tile.md) and [Markbox](markbox.md): cards, tiles and marks.
- [Avatar](avatar.md), [Presence](presence.md) and [Pin](pin.md):
  people, and marks on a canvas.
- [State](state.md) and [Spinner](spinner.md): empty, loading and
  failed places, and a short wait.

## Overlay and feedback

- [Modal](modal.md), [Confirm](confirm.md), [Drawer](drawer.md),
  [Sheet](sheet.md) and [Veil](veil.md): surfaces laid over the screen
  or over a frame.
- [Popover](popover.md), [Bubble](bubble.md), [Tooltip](tooltip.md) and
  [Floating](floating.md): small surfaces next to a trigger, a word that
  explains a control, and a container over a drawing.
- [Menu](menu.md), [MenuItem](menu-item.md), [MenuHead](menu-head.md),
  [MenuDivider](menu-divider.md), [Dropdown](dropdown.md) and
  [Kebab](kebab.md): lists of actions and the place they open in.
- [Banner](banner.md), [Note](note.md), [Notices](notices.md),
  [Toast](toast.md), [ToastHost](toast-host.md) and [Bulk](bulk.md):
  notices, messages that go by themselves, and the bar of actions on a
  selection.

## Structure

- [Panel](panel.md), [Toolbar](toolbar.md), [Topbar](topbar.md),
  [Drawbar](drawbar.md) and [Fab](fab.md): the columns of the screen,
  their heads, the bars of tools and the floating action.
- [Tabs](tabs.md) and [Crumbs](crumbs.md): the views of a place, and the
  trail to it.
- [Tree](tree.md), [TreeRow](tree-row.md), [DropLine](drop-line.md),
  [DropTarget](drop-target.md) and the [sortable](sortable.md) action: a
  list with depth, reordered by dragging, and the place to drop files.
- [Disclosure](disclosure.md) and [FilterBar](filter-bar.md): a group that
  opens and closes, and the filters in effect.
- [SettingsPage](settings-page.md): the frame of a settings page.
- [Comment](comment.md) and [Thread](thread.md): the messages of a
  conversation and their replies.

## Strings

The strings a component shows on its own are English by default.
`setMessages` replaces any of them, for example when the application's
language changes, and the components on screen update. `getMessages`
returns the strings in effect and `defaultMessages` the English ones.

```ts
import { setMessages } from '@sakuzu/kata/svelte';

setMessages({ fontScaleLarge: 'Groß' });
setMessages({}, { reset: true }); // back to English
```

## Icons

`icons` lists the icons the components draw by name: `arrow-up-right`,
`check`, `chevron-down`, `image`, `pencil`, `pipette`, `plus`, `search`
and `x`, from [Lucide](https://lucide.dev), and kata's drawing glyphs
`point`, `polyline`, `polygon`, `arrow` and `sticky-note`. Wherever a component
takes an icon, it also takes any icon component, such as another Lucide
icon.

The overlay and feedback components add `arrow-left`, `chevron-right`,
`circle-alert`, `circle-check`, `copy`, `corner-up-right`, `ellipsis`,
`globe`, `info`, `settings-2`, `share-2`, `trash-2`, `triangle-alert`
and `ungroup`. The data display components add `chevron-left`, and the
structure components `funnel` and `grip-vertical`.

## Helpers

- `setFontScale`, `readFontScale`, `fontScaleLabel` and `FONT_SCALES` set
  and read the text size setting (`data-font-scale` on the root element)
  and remember it under `FONT_SCALE_STORAGE_KEY` in local storage.
- `createNarrow` and `isNarrowerThan` tell whether the window is narrower
  than a width in rem, as the layouts' container queries do; `WIDTHS`
  holds the three widths (24, 48 and 64rem).
- `clampTip` is an action for an element that clips its text with an
  ellipsis: the full text shows on hover and on keyboard focus.
- `toast` is the store of the messages that [ToastHost](toast-host.md)
  shows: `toast.show()` and `toast.error()` add one, `toast.dismiss()`
  removes one, and each goes by itself after `TOAST_DURATION`.
