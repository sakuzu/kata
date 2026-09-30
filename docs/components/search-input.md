# SearchInput

SearchInput is the input of a search.

## When to use

Use it above a list that it filters, or to search a collection. `label`
names it; inside a [Field](field.md) the field names it. The keys, such
as clearing with Escape, are the application's, through `onkeydown`.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `value` | `''` | The query (bindable) |
| `placeholder` | `''` | Shown while it is empty |
| `label` | | The accessible name |
| `id` | | The id of the input |
| `disabled` | `false` | Cannot be focused or changed |
| `onkeydown` | | The keys |
| `oninput` | | Every key stroke |

## Contract

It is the control of a [TextInput](text-input.md) with a magnifying
glass, muted, gap-sm before the text. The browser's clear button is
hidden.

## Example

[SearchInput](../../examples/search-input/)
