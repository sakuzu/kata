# Topbar

Topbar is the toolbar at the top of the screen: the brand, the current
place, a title and the actions.

## When to use

Use it once per screen, above everything else. The application passes
what it shows: its name in `brand` (a link with `brandHref`, or the
trigger of its menu with `brandMenu`), the trail to the current place in
`crumbs`, the name of the open document in `center` (an
[InlineEdit](inline-edit.md) when it can be renamed), who else is here in
`presence` (a [Presence](presence.md)), and its actions in `end`.
`lead` holds a button before the brand, such as the one that opens a
drawer on a narrow screen. The head of a panel or a modal is a
[Toolbar](toolbar.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `brand` | | The application's name; without it, no brand |
| `brandHref` | | Draws the brand as a link, with the same look |
| `brandTarget` | | `_blank` opens the brand's link in another tab |
| `brandMenu` | | The brand opens a menu: its MenuItems (a snippet) |
| `menu` | | The brand opens a menu drawn from a model (`MenuModel[]`) |
| `onmenu` | | Called with the id of the chosen item of `menu` |
| `brandLabel` | | The name of the menu's trigger |
| `crumbs` | | The trail to the current place, `{ label, href?, onclick? }[]` |
| `crumbsLabel` | | The name of the trail |
| `lead` | | Before the brand (a snippet) |
| `start` | | After the brand and the crumbs (a snippet) |
| `center` | | A title or an inline edit in the centre (a snippet) |
| `presence` | | Who else is here, before `end` (a snippet of `{ compact }`) |
| `end` | | The actions at the right end (a snippet of `{ compact }`) |

## Contract

The height is a [Toolbar](toolbar.md)'s, the surface the panel color,
with a strong line along the bottom; pad-md at the sides and small
buttons inside. The brand is h2, trimmed to its ink, with its letters
drawn a little closer (`--kata-topbar-brand-tracking`, `-0.01em` unless
the page sets it); with `brandMenu` it
is a button without a line, with a chevron, that opens a
[Dropdown](dropdown.md) menu below it (the snippet receives `close`).
`menu` opens the same Dropdown with a [MenuList](../workbench/menu-list.md)
of the model, as an [AppMenu](../workbench/app-menu.md) does.
The centre takes the rest of the width and shrinks first, and what is in
it clips its own text. The end holds `presence` and `end` as two groups
gap-md apart; inside a group, icon buttons sit side by side. Nothing
wraps and the places never overlap.

The brand is never hidden. The bar measures its row when its width or
its content changes, and when the row does not fit it compacts the end
in two steps. First `presence` receives `{ compact: true }`: the
application shows a count instead of the faces (`Presence max={0}`).
When that does not fit either, `end` receives `{ compact: true }` too:
the application folds its actions into a [Kebab](kebab.md). The bar
stops at the first step that fits and goes back when the width allows
the row again. When even that does not fit, the start shrinks: the crumbs
and the brand end with an ellipsis. A snippet that takes no
argument works as before and is not compacted.

## Example

[Topbar](../../examples/topbar/)
