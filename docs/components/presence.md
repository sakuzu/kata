# Presence

Presence shows the people who are here now, as overlapping avatars, or
the roster of everyone.

## When to use

Put it in a toolbar of a shared document. `max` sets how many avatars
show; the others gather as "+n", so that many people never widen it.
`roster` renders the list of everyone instead (name, "(you)" and role),
for a menu or a panel that holds it. Each person has an `id` when names
can repeat (the same person in two places).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `users` | required | The people (below) |
| `max` | `3` | How many avatars show before "+n" |
| `roster` | `false` | Renders the roster only |

Each person has `name`, and optionally `id` (a unique key; without it
the position in the list), `color` (the surface of their avatar), `role`
(`edit` or `view`) and `you`.

## Contract

The avatars are circles of a small button that overlap by gap-xs, each
with a ring two lines wide in the panel colour; the one under the
pointer comes to the front. A person's colour is the surface of their
avatar, without one the fill colour; the contrast of a colour is the
caller's. The initials are the first two letters of a Latin name,
otherwise its first character. The roster has no container of its own:
a caption with the count and, with more than eight people, a search, in
a Block, then the people as list items with a line between them, a small
avatar and a badge of the role; eight items show and more scroll. The
words come from the messages `participants`, `showMore`, `searchByName`,
`searchParticipants`, `noParticipants`, `you`, `roleEditor` and
`roleViewer`.

## Example

[Presence](../../examples/presence/)
