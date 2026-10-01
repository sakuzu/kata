# Shell

Shell is the frame of a drawing application: the bar at the top, a
region on each side, the stage in the middle, the toolbar over the
bottom of the stage and a dock under it, with the keyboard shortcuts of
the whole screen.

## When to use

Use it once, as the whole screen of a drawing application. Each region
is a snippet and any may be absent: the application passes a
[Topbar](../components/topbar.md) in `top`, a
[Panel](../components/panel.md) in `left` and in `right`, a
[Drawbar](../components/drawbar.md) in `bottom`, a Panel with
`side="fill"` in `dock`, and whatever it draws on in `stage`. The shell
places them and moves the side regions as the window narrows; it knows
nothing of what they hold. A special mode of the application, such as a
print preview or an older version, is a change of what the application
passes in `stage` and the side regions, not a mode of the shell.

Use `overlay` when the shell lies over a drawing surface that the page
owns, such as a map that is not passed in `stage`: the shell lets the
pointer through to it everywhere but its regions.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `leftOpen` | `true` | Whether the left region shows (bindable) |
| `rightOpen` | `false` | Whether the right region shows (bindable) |
| `dockHeight` | | The dock's height in px (bindable); 38.2% without it |
| `shortcuts` | `[]` | The keyboard shortcuts, `Shortcut[]` |
| `shortcutsOpen` | `false` | Whether the list of shortcuts is open (bindable) |
| `overlay` | `false` | Lets the pointer through, except on its regions |
| `leftLabel` | | The name of the left region's sheet |
| `rightLabel` | | The name of the right region's sheet |
| `onlayout` | | Called with `{ width, leftMode, rightMode }` when they change |
| `onescape` | | Called with Escape when no pane is left to close |

`width` is `wide`, `mid` or `narrow`, and each mode is `beside`,
`floating` or `sheet`. `onescape` returns `false` to leave the key to the
browser.

A `Shortcut` is `{ key, label, run, when?, group? }`. `key` is written
without regard to the platform: modifiers joined with `+`, then one key,
such as `mod+z`, `shift+mod+z`, `alt+l` or `?`; `mod` is ⌘ on a Mac and
Ctrl elsewhere, and named keys are `escape`, `enter`, `tab`, `space`,
`backspace`, `delete`, `plus`, `minus`, the arrows `up`, `down`, `left`
and `right`, `home`, `end`, `pageup`, `pagedown` and `f1` to `f12`.
`run` is called with the key event; when it returns `false` the key goes
on to the next shortcut with the same key, and to the browser. `when`
says whether the shortcut acts now, and `group` is the heading it is
listed under. `formatShortcut(key)` writes a key as the platform does
(⇧⌘Z on a Mac, Ctrl+Shift+Z elsewhere), for a tooltip or a menu.

## Snippets

| Snippet | Holds |
| --- | --- |
| `top` | The bar at the top, a Topbar |
| `left` | The left region, a Panel |
| `right` | The right region, a Panel |
| `stage` | The drawing surface; it fills the rest |
| `bottom` | The toolbar over the bottom of the stage, a Drawbar |
| `dock` | The area under the stage, a Panel with `side="fill"` |
| `veil` | While given, it covers the stage in a [Veil](../components/veil.md) |

## Layout

The side regions follow the three widths of the layout, measured in rem
so that a larger text size counts as a narrower window. The shell
measures its own element, not the window, and it is the size container
`app` of everything inside it, so the components in its regions follow
the shell's width too, with or without the base CSS. When the browser
has no `ResizeObserver`, it measures the window.

- From 64rem, the side regions stand beside the stage, as tall as the
  space under the bar, with a strong line towards the stage.
- From 48 to 64rem, they float over the stage in a
  [Floating](../components/floating.md), gap-md from its edges and no
  wider than half the stage, over a scrim that closes them when pressed.
- Below 48rem, each is a [Sheet](../components/sheet.md) from the bottom
  of the stage, and the toolbar rises to stay above the sheets.

## Contract

The top bar keeps its height. Under it, the side regions and a column of
the stage and the dock fill the rest; the stage is the positioned frame
of everything that lies over the drawing: the toolbar, the floating
panes, the sheets and the veil. The dock is under the stage with a
strong line along its top, at least a toolbar high, and it leaves the
stage a toolbar's height at least. Its top edge is a grip without a
look: a drag changes `dockHeight`, the arrow keys move it by 32px, and
the value that is kept is the height after those limits. The grip's name
is the `dockHeight` message and the scrim's the `closePanes` message.

The shortcuts are attached to the document while the shell is mounted.
The first shortcut whose key matches and whose `when` holds runs. The
help key (?, the Help key or F1) opens a
[ShortcutsModal](shortcuts-modal.md) that lists them, unless a shortcut
takes the key first. Escape closes the floating pane or the sheet that
was opened last and returns the focus to where it was when that pane
opened; when none is open, it goes to `onescape`. Beside the stage, the
panels stay open on Escape. Keys typed into a field, keys an input
method is composing, keys already handled (`defaultPrevented`) and keys
pressed while a modal dialog or a popover is open belong to them, not to
the shell.

With `overlay`, the root and the stage have `pointer-events: none`, and
the bar, the side regions, the toolbar, the dock, the scrim, the
floating panes, the sheets, the veil and the list of shortcuts have
`pointer-events: auto`. What the application passes in `stage` lets the
pointer through too.

## Example

[Shell](../../examples/shell/)
