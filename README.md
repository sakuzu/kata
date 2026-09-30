# kata

kata is the design system of sakuzu, an organization that publishes
open-source tools for drawing: a map editor, a whiteboard, a globe, and the
examples and standard UI of a drawing library. It gives these tools one
look and one set of rules, and it is written for anyone who builds a
drawing application on the web and wants the same foundation.

kata has three layers.

1. A foundation that needs no framework: a numeric scale derived from the
   golden ratio φ as its single root, tokens (CSS custom properties for
   spacing, type and color), base CSS, and the rules that tie them
   together. One stylesheet brings it into any web page.
2. Components, bound first for Svelte and published in
   `@sakuzu/kata/svelte`: 110 of them, in the layout and text components
   and four families.
   - Layout and text: Stack, Row, Grid, Split, Block, Section,
     SectionHeader, Divider, Indent, Page, PageHeader, Footer, Text,
     Prose, Kbd, Icon, Thumbnail, Figure and Glyphs.
   - Controls: Button, LinkAction, Actions, Counter, Toggle, Checkbox,
     Radio, RadioGroup, Segmented, Slider, TextInput, Textarea,
     NumberInput, SearchInput, InlineEdit, FileInput, Field, InputGroup,
     Select, NativeSelect, ColorPicker, ColorGrid, Swatch and Palette.
   - Data display: Badge, Tag, Chip, ChipValue, Pair, Kv, ReadValue,
     Stat, Stats, Meter, Progress, StepBar, Bars, List, ListItem, Table,
     ColHead, Pager, Tcard, Tcards, Card, Board, Gtile, Tile, Markbox,
     Avatar, Presence, Pin, State and Spinner.
   - Overlay and feedback: Modal, Confirm, Drawer, Sheet, Veil, Popover,
     Bubble, Tooltip, Floating, Menu, MenuItem, MenuHead, MenuDivider,
     Dropdown, Kebab, Banner, Note, Notices, Toast, ToastHost and Bulk.
   - Structure: Panel, Toolbar, Topbar, Drawbar, Fab, Tabs, Crumbs, Tree,
     TreeRow, DropLine, DropTarget, Disclosure, FilterBar, SettingsPage,
     Comment and Thread, with the `sortable` action.
3. Parts for drawing applications, the workbench: the shell, the layer
   tree, the menus, the comments, the inspector, settings and the
   toolbar. They know nothing about what is drawn; the application
   passes the content in. Published so far in `@sakuzu/kata/svelte`:
   LayerTree, MenuList, AppMenu, MenuSheet, CommentList and
   CommentComposer.

## Install

```sh
npm install @sakuzu/kata
```

The package has four entries. The first three are plain CSS; the fourth
needs Svelte 5, which is an optional peer dependency.

| Entry | Contents |
| --- | --- |
| `@sakuzu/kata` | The scale, the tokens and the base CSS |
| `@sakuzu/kata/tokens.css` | The scale and the tokens, no global rules |
| `@sakuzu/kata/base.css` | The base CSS alone (it needs the tokens) |
| `@sakuzu/kata/svelte` | The Svelte components (they need the tokens) |

Import the whole foundation once and write with the tokens.

```css
@import "@sakuzu/kata";
.note {
  padding: var(--kata-pad-md);
  background: var(--kata-color-panel);
}
```

Without a bundler, link `node_modules/@sakuzu/kata/dist/kata.css` from the
page. The theme is dark; `data-color-mode="light"` on any element turns
the elements inside it light.

## The scale

Every length in kata comes from one number, φ = 1.618. The whole step is φ,
the half step its square root and the quarter step its fourth root. Seven
sizes run from 1 ÷ φ³ to 1 × φ³, once in em (for padding, which follows the
component's text) and once in rem (for gaps, which follow the root). Eight
type roles take their size from powers of φ in quarter steps and their line
height from the half or the whole step. The generator is
`src/scale/scale.mjs`, and `npm run scale` writes its output to
`src/tokens/scale.css`. [The scale](docs/scale.md) explains the formulas
and lists the values.

## Documentation

The chapters are in [docs](docs/README.md): the principles, the scale, the
tokens, the [components](docs/components/README.md), the
[workbench](docs/workbench/README.md) and the [checks](docs/checks.md).
`npm run site:dev` serves them as a site, with a live example of each
component.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for the checks that a change must pass.

## Development

```sh
npm install
npm test               # the scale, the tokens and the components
npm run typecheck      # TypeScript and svelte-check
npm run lint           # Biome and markdownlint
npm run audit          # the components' styles and measurements
npm run package        # the CSS and the Svelte entry in dist/
npm run check:terms    # the vocabulary rule
npm run site:build     # the documentation site and the examples
```

## License

Apache-2.0. Copyright 2026 Kasika, Inc. See [LICENSE](LICENSE) and
[NOTICE](NOTICE).

The numeric scale follows ideas from LiftKit (Chainlift); no code or text
from it is included.
