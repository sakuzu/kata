# Changelog

All notable changes to `@sakuzu/kata` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
follows semantic versioning.

## [Unreleased]

### Added

- The numeric scale: one root (φ), three steps, seven sizes and eight type
  roles, generated as CSS custom properties by `npm run scale`.
- Tokens for spacing, type, color, lines, widths, heights and layering.
- Base CSS: the reset and the rules every page shares.
- The documents Principles, Scale and Tokens, and the documentation site.
- The Svelte entry `@sakuzu/kata/svelte` with the layout and text
  components (Stack, Row, Grid, Split, Block, Section, SectionHeader,
  Divider, Indent, Page, PageHeader, Footer, Text, Prose, Kbd, Icon,
  Thumbnail, Figure and Glyphs), the messages API, the icons and the
  helpers for the text size setting, the widths and clipped text.
- A page and a live example for each component, and the Checks chapter.
- The audit (`npm run audit`): the components' styles are read and their
  examples measured in a browser.
- The structure components (Panel, Toolbar, Topbar, Drawbar, Fab, Tabs,
  Crumbs, Tree, TreeRow, DropLine, DropTarget, Disclosure, FilterBar,
  SettingsPage, Comment and Thread) and the `sortable` action, which
  reorders items by dragging with SortableJS.
