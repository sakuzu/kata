# SearchPanel

SearchPanel is a panel that finds things: an input, then the results in
groups.

## When to use

Use it to find anything the application can list by name: the things on
the stage, the pages, the commands. The application passes the results
in groups and decides what a pick does; the panel knows nothing of what
is found. For a short list that is already at hand, let the panel filter
it (the default). For a search that runs elsewhere, pass `filter={false}`,
search on `onquery` and pass the results back in `groups`. An input
alone, without results of its own, is a
[SearchInput](../components/search-input.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `groups` | required | The results, `{ label, items: SearchItem[] }[]` |
| `query` | `''` | The query in the input (bindable) |
| `onquery` | | Called with the query on every key stroke |
| `onpick` | | Called with the id of the result that is pressed |
| `filter` | `true` | Keep the results that contain the query |
| `title` | `search` message | The title in the head and the name of the input |
| `placeholder` | | The faint text in the empty input |
| `empty` | `noMatches` message | What shows when the query has no result |
| `hint` | | What shows while the query is empty and nothing shows |
| `onclose` | | Shows a close button in the head |
| `side` | `panel` | The width, as [Panel](../components/panel.md)'s `side` |

A `SearchItem` is `{ id, label, hint?, icon? }`: `hint` is a second line
under the name, and `icon` an icon name or component.

## Contract

A [Panel](../components/panel.md) with a
[Toolbar](../components/toolbar.md) as its head. The content starts with
the [SearchInput](../components/search-input.md) in a
[Block](../components/block.md); each group that has results follows as a
[SectionHeader](../components/section-header.md) over a
[List](../components/list.md), and each result is a pressable
[ListItem](../components/list-item.md) with its icon, its name and its
hint on one line each. With `filter`, a result stays when its name or its
hint contains the query, ignoring case, and a group left empty is hidden.
Enter in the input picks the first result and Escape clears the query.
When nothing shows, a [State](../components/state.md) says `empty` for a
query, or `hint` while the query is empty.

## Example

[SearchPanel](../../examples/search-panel/)
