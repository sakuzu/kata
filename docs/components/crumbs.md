# Crumbs

Crumbs is a trail of places that shows where the user is.

## When to use

Use it above the title of a page (in the `crumbs` of a
[PageHeader](page-header.md)) or next to the brand in a
[Topbar](topbar.md). The last place is the current one. A trail is not
an action: to go somewhere else, use a link or a button.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `items` | required | The places, `{ label, href?, onclick? }[]` |
| `label` | | The name of the trail |
| `current` | `true` | The last place is the current one |

## Contract

The text is caption in the color of the text around it, and the chevrons
are faint; a place with `href` is a link and one with `onclick` a
button, both in the same color and underlined on hover. The last
place is the current one (`aria-current="page"`) and cannot be pressed;
with `current={false}` it is a place like the others, a link or a button
when it has `href` or `onclick` and without `aria-current`, for a trail
followed by a title outside it that is the current place. A chevron then
follows the last place too, with gap-2xs after it, so the application
puts the title right after the trail without a separator of its own.
The places are gap-2xs from the chevrons that separate them. Each place
is at most 12rem wide and ends with an ellipsis beyond it, with the full
text on hover and on keyboard focus; when the width runs out the places
shrink down to 4rem (a shorter place keeps its own width), and the trail
shrinks before what stands next to it. Inside a component with a height
(a toolbar, a list item) the text is trimmed to its ink.

The trail is never squeezed further: it folds by its own width. When
the places do not fit at 4rem each, only the last place shows, the
current one, without a "…" before it; when even that does not fit at
4rem, no place shows, and the trail keeps its name (`label`). The
widths are measured on a hidden copy of the whole trail, and the trail
keeps the width of the whole copy, so it unfolds when there is room
again.

## Example

[Crumbs](../../examples/crumbs/)
