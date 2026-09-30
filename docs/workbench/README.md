# Workbench

The workbench parts are the large parts that drawing applications share:
the comments, the dialogs, the layer tree, the menus, the panels, the
settings and the toolbar. They are Svelte 5
components in `@sakuzu/kata/svelte`, built from the
[components](../components/README.md), and they need the same stylesheet.

```svelte
<script>
  import '@sakuzu/kata';
  import { SearchPanel } from '@sakuzu/kata/svelte';
</script>

<SearchPanel {groups} onpick={(id) => select(id)} />
```

A workbench part knows nothing of what the application draws. It takes
its data in general shapes (an id, a name, an icon and a count), and the
application passes the content in through props and snippets: the
fields, the actions and the detail of a place. A part reports what the
person does, and the application applies it to its own data. The words
a part shows on its own come from the
[messages API](../components/README.md#strings), in English by default.

Each page below describes one part: what it is, when to use it, its
props, its contract and a live example.

## Comments

- [CommentComposer](comment-composer.md): where a comment or a reply is
  written.
- [CommentList](comment-list.md): the threads of a document, with their
  replies, to open and resolve.

## Dialogs

- [ProcessDialog](process-dialog.md): a process with its fields, run or
  cancelled.
- [SourcePicker](source-picker.md): the places something can come from,
  and the detail of the current one.

## Inspector

- [InspectorFrame](inspector-frame.md): the panel of the thing selected,
  with its name changed in place, its tabs and its sections.
- [InspectorSection](inspector-section.md) and
  [InspectorRow](inspector-row.md): the groups that fold and the rows of
  an inspector.
- [FieldList](field-list.md): the rows of settings drawn from field
  specs, with the values a selection does not share.
- [AttributeList](attribute-list.md): the attributes of a thing, read or
  changed where they stand.

## Layers

- [LayerTree](layer-tree.md): the layers, groups and items of a drawing,
  with the eye, the lock, renaming in place, reordering by dragging and
  an add menu.

## Menus

- [AppMenu](app-menu.md): the menu of the application behind one button.
- [MenuList](menu-list.md): a menu drawn from its model (`MenuModel`),
  with submenus.
- [MenuSheet](menu-sheet.md): the same menu in a sheet on a narrow
  screen.

## Panels

- [SearchPanel](search-panel.md): an input and the results in groups.
- [SelectionSummary](selection-summary.md): the counts, the shared fields
  and the actions of a selection of several things.
- [VersionsPanel](versions-panel.md): the saved versions of a document,
  to look at and to restore.

## Settings

- [SettingsRow](settings-row.md) and
  [SettingsSection](settings-section.md): the rows and the groups of a
  [SettingsPage](../components/settings-page.md).

## Shell

- [Shell](shell.md): the frame of the editor, with the bar, the side
  regions, the stage, the toolbar and the dock, and the keyboard
  shortcuts.
- [ShortcutsModal](shortcuts-modal.md): the list of the keyboard
  shortcuts.

## Toolbar

- [Drawbar](../components/drawbar.md): the bar of drawing tools, with the
  switches of the aids after the tools and a More menu for what does not
  fit.
