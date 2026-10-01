# Changelog

All notable changes to `@sakuzu/kata` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
follows semantic versioning.

## [Unreleased]

These changes will be released as 1.3.0.

- Added: `InspectorFrame underHead`, a snippet placed under the head and
  above the tabs, for a band of the application such as a palette. It
  keeps its place while the content scrolls.
- Added: `InspectorSection value`, the current value shown muted on the
  right of the head, before the actions, as a Disclosure shows it. It
  shows whether the section folds or not, and while it is closed.

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

[1.2.0]: https://github.com/sakuzu/kata/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sakuzu/kata/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sakuzu/kata/releases/tag/v1.0.0
