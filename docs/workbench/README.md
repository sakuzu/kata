# Workbench

The workbench parts are the large parts that drawing applications share:
the settings, the toolbar, the panels and the dialogs. They are Svelte 5
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
fields, the actions and the detail of a place. The words a part shows on
its own come from the [messages API](../components/README.md#strings),
in English by default.

Each page below describes one part: what it is, when to use it, its
props, its contract and a live example.

## Settings

- [SettingsSection](settings-section.md) and
  [SettingsRow](settings-row.md): the groups and the rows of a
  [SettingsPage](../components/settings-page.md).

## Toolbar

- [Drawbar](../components/drawbar.md): the bar of drawing tools, with the
  switches of the aids after the tools and a More menu for what does not
  fit.

## Panels

- [SearchPanel](search-panel.md): an input and the results in groups.
- [VersionsPanel](versions-panel.md): the saved versions of a document,
  to look at and to restore.
- [SelectionSummary](selection-summary.md): the counts, the shared fields
  and the actions of a selection of several things.

## Dialogs

- [ProcessDialog](process-dialog.md): a process with its fields, run or
  cancelled.
- [SourcePicker](source-picker.md): the places something can come from,
  and the detail of the current one.
