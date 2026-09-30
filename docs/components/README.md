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

`icons` lists the icons the components draw by name: `image`, from
[Lucide](https://lucide.dev), and kata's drawing glyphs `point`,
`polyline`, `polygon`, `arrow` and `sticky-note`. Wherever a component
takes an icon, it also takes any icon component, such as another Lucide
icon.

## Helpers

- `setFontScale`, `readFontScale`, `fontScaleLabel` and `FONT_SCALES` set
  and read the text size setting (`data-font-scale` on the root element)
  and remember it under `FONT_SCALE_STORAGE_KEY` in local storage.
- `createNarrow` and `isNarrowerThan` tell whether the window is narrower
  than a width in rem, as the layouts' container queries do; `WIDTHS`
  holds the three widths (24, 48 and 64rem).
- `clampTip` is an action for an element that clips its text with an
  ellipsis: the full text shows on hover and on keyboard focus.
