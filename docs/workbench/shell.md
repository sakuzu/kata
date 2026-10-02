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

By default the side regions float over the stage, as they do in the
editor of the reference application; `side="beside"` stands them beside
the stage on a wide screen instead.

Use `overlay` when the shell lies over a drawing surface that the page
owns, such as a map that is not passed in `stage`: the shell lets the
pointer through to it everywhere but its regions.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `side` | `'floating'` | From 64rem, `'floating'` or `'beside'` |
| `narrow` | | `true`: the narrow form at any width; `false`: never |
| `leftOpen` | `true` | Whether the left region shows (bindable) |
| `rightOpen` | `false` | Whether the right region shows (bindable) |
| `dockHeight` | | The dock's height in px (bindable); 38.2% without it |
| `shortcuts` | `[]` | The keyboard shortcuts, `Shortcut[]` |
| `shortcutsOpen` | `false` | Whether the list of shortcuts is open (bindable) |
| `groups` | | The order of the groups in the list of shortcuts |
| `overlay` | `false` | Lets the pointer through, except on its regions |
| `leftLabel` | | The name of the left region's sheet |
| `rightLabel` | | The name of the right region's sheet |
| `leftSheet` | | The left sheet's heights and closing, `ShellSheet` |
| `rightSheet` | | The right sheet's heights and closing, `ShellSheet` |
| `leftStage` | `'half'` | The left sheet's height while open (bindable) |
| `rightStage` | `'half'` | The right sheet's height while open (bindable) |
| `leftReopen` | | A control that opens the closed left region, `ShellReopen` |
| `rightReopen` | | A control that opens the closed right region |
| `bottomFab` | | Folds the toolbar into a Fab when narrow, `ShellFab` |
| `dockSheet` | | The dock's sheet when narrow, `ShellDockSheet` |
| `ondockclose` | | Called when the dock's sheet closes |
| `topFloating` | `false` | The bar floats over the stage when narrow |
| `onlayout` | | Called with `{ width, leftMode, rightMode, inset }` on change |
| `onescape` | | Called with Escape when no sheet is left to close |

`width` is `wide`, `mid` or `narrow`, and each mode is `beside`,
`floating` or `sheet` (`ShellLayout`, `ShellWidth` and `ShellMode`; the
type of `side` is `ShellSide`). `inset` is
`{ top, right, bottom, left }` in px: what the regions cover of the
stage, from each edge of the stage to the inner edge of the region on
that side (see [Inset](#inset)). `onescape` returns `false` to leave the
key to the browser.

A `ShellSheet` is `{ stages?, closable? }`: `stages` are the heights the
sheet offers, lowest first (`SheetStage[]`, all three by default), and
`closable: false` keeps the sheet when it is dragged below the lowest
height (it closes by default). A stage is `peek`, `half` or `full`
(`SheetStage`).

A `ShellReopen` is `{ icon, label }`: an icon name or component, and the
name of the control. A `ShellFab` is `{ label, closeLabel, icon? }`: the
name of the Fab while the toolbar is hidden and while it shows, and its
icon while the toolbar is hidden (`plus` by default; `x` while it
shows). A `ShellDockSheet` is `{ label, stages? }`: the name of the sheet
and the heights it offers, lowest first (`half` and `full` by default).

A `Shortcut` is
`{ key, label, run, when?, group?, aliases?, hidden?, display? }`. `key`
is written without regard to the platform: modifiers joined with `+`,
then one key, such as `mod+z`, `shift+mod+z`, `alt+l` or `?`; `mod` is ⌘
on a Mac and Ctrl elsewhere, and named keys are `escape`, `enter`,
`tab`, `space`, `backspace`, `delete`, `plus`, `minus`, the arrows `up`,
`down`, `left` and `right`, `home`, `end`, `pageup`, `pagedown` and `f1`
to `f12`. `digit` is any of the keys 0 to 9, and `run` reads which one
from the key event. A modifier alone (`alt`, `shift` or `mod`) is the
press of that key with no other key. A letter, a digit, a symbol such as
`[` or `/`, `plus` and `minus` also match by the physical key, so that
they still count when ⌥ on a Mac turns them into another character.
`run` is called with the key event; when it returns `false` the key goes
on to the next shortcut with the same key, and to the browser. `when`
says whether the shortcut acts now, and `group` is the heading it is
listed under.

| Key | Description |
| --- | --- |
| `aliases` | More keys that run it, not listed (`backspace` for `delete`) |
| `hidden` | It runs but is not listed |
| `display` | The keys listed instead of `key`, joined with " / " |

`formatShortcut(key)` writes a key as the platform does (⇧⌘Z on a Mac,
Ctrl+Shift+Z elsewhere; `digit` as 0–9, and a modifier alone as ⌥ or
Alt), for a tooltip or a menu, and `isMacPlatform()` says whether the
platform is a Mac, where `mod` is ⌘. The shell's own matching is
exported for the application's tests and its own listeners:
`matchesShortcut(key, event)` says whether a key event is that key,
`matchesAnyShortcut(shortcut, event)` whether it is the key or one of
the aliases of a shortcut, and `shortcutText(shortcut)` writes its keys
as the list does.

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

- From 48rem, the side regions float over the stage, each in a
  [Floating](../components/floating.md) gap-md from the top of the stage
  and from its own side. A pane is a panel wide (`--kata-width-panel`)
  and no wider than the stage less gap-md on each side. It is as tall as
  what it holds, up to the height of the stage less gap-md above and
  below; beyond that the content of the Panel in it scrolls. Both may be
  open at once, there is no scrim, and the stage takes the pointer
  wherever a pane is not. At 48rem two panes and the three gaps around
  them fill the stage exactly.
- With `side="beside"`, from 64rem the side regions stand beside the
  stage instead, as tall as the space under the bar, with a strong line
  towards the stage; from 48 to 64rem they float as above.
- Below 48rem, each is a [Sheet](../components/sheet.md) from the bottom
  of the stage, and the toolbar rises to stay above the sheets.

| Width | `side="floating"` | `side="beside"` |
| --- | --- | --- |
| From 64rem (`wide`) | `floating` | `beside` |
| 48 to 64rem (`mid`) | `floating` | `floating` |
| Below 48rem (`narrow`) | `sheet` | `sheet` |

## Contract

The top bar keeps its height. Under it, the side regions and a column of
the stage and the dock fill the rest; the stage is the positioned frame
of everything that lies over the drawing: the toolbar, the floating
panes, the sheets and the veil. The dock is under the stage with a
strong line along its top, at least a toolbar high, and it leaves the
stage a toolbar's height at least. Its top edge is a grip without a
look: a drag changes `dockHeight`, the arrow keys move it by 32px, and
the value that is kept is the height after those limits. The grip's name
is the `dockHeight` message. The floating panes lie over the stage, which
is above the dock, so their limit leaves the dock out.

The shortcuts are attached to the document while the shell is mounted.
The first shortcut whose key matches and whose `when` holds runs. The
help key (?, the Help key or F1) opens a
[ShortcutsModal](shortcuts-modal.md) that lists them, unless a shortcut
takes the key first. Escape closes the sheet that was opened last and
returns the focus to where it was when that sheet opened; when none is
open, it goes to `onescape`. The floating panes and the panels beside
the stage stay open on Escape, which goes straight to `onescape`. Keys
typed into a field, keys an input method is composing, keys already
handled (`defaultPrevented`) and keys pressed while a modal dialog or a
popover is open belong to them, not to the shell.

With `overlay`, the root and the stage have `pointer-events: none`, and
the bar, the side regions, the toolbar, the dock, the floating panes,
the sheets, the veil and the list of shortcuts have
`pointer-events: auto`. What the application passes in `stage` lets the
pointer through too.

With `narrow`, the shell takes the narrow form at any width: the side
regions are sheets and `onlayout` reports the width as `narrow`, as for
a short window or a shell embedded in a small frame. With
`narrow={false}` it never does: below 48rem the width is `mid` and the
side regions float. Without it, the width decides.

On a narrow screen, `leftSheet` and `rightSheet` set the heights each
side's sheet offers and whether it closes. A sheet with
`closable: false` does not close below its lowest height, and while its
region is not open (`leftOpen` or `rightOpen` is false) it stays at that
height, so that its head still shows; raising it opens the region again.
It rests under the sheets that are open, Escape passes it by, and the
toolbar rises above it too. `leftStage` and `rightStage` are the height
of each sheet while its region is open: the application reads them and
can set them, to lower a sheet to its lowest height instead of closing
it, say.

From 48rem, `leftReopen` and `rightReopen` put a control in the corner
of the stage on their side while that region is closed: a ghost icon
button in a [Floating](../components/floating.md) gap-md from the top
and from the side, which sets `leftOpen` or `rightOpen` when pressed. It
shows only when the region is given. The narrow form has none: a sheet
that does not close keeps its head, and the application has its own way
in otherwise.

With `bottomFab`, the narrow form folds the toolbar into a
[Fab](../components/fab.md), gap-md from the right of the stage and from
the top of the sheets. A press on the Fab shows the toolbar above it,
gap-md apart and gap-md from the right, and another press hides it; while
it shows, the Fab's name is `closeLabel` and its icon `x`. The `bottom`
snippet receives `{ column }`, true while the toolbar stands in one
column above the Fab and false elsewhere: pass it to the Drawbar's
`column`. A snippet that takes no argument works as before. The column
stays between gap-md below the top inset of the stage and gap-md above
the Fab, and scrolls when it does not fit there. From 48rem the toolbar
stays over the bottom of the stage.

The narrow form puts the dock in a [Sheet](../components/sheet.md) named
`dock` instead of the area under the stage; `dockSheet` gives the
sheet's name and heights (without it, the `dock` message and `half` and
`full`). The sheet holds the dock as a panel, opens at the lowest of its
heights and closes below it; it then calls `ondockclose`, and the
application removes the dock. It lies under the sheets of the side
regions, and the toolbar rises above it as above them. `dockHeight` and
the grip belong to the dock under the stage only.

On a narrow screen one of the side sheets and the dock is open at a
time. Opening a side sheet closes the other side (its `leftOpen` or
`rightOpen` becomes false) and the dock (`ondockclose` is called); the
dock's sheet coming, when the application gives the dock or the screen
narrows with it, closes the side sheets. A sheet that rests at its
lowest height (`closable: false`) does not count as open and stays.
When the screen narrows with both side regions open, the one opened
last stays, the right one at mount.

With `topFloating`, the narrow form floats the bar over the stage in a
[Floating](../components/floating.md) gap-md from the top of the stage
and from each side, instead of keeping its height above it; the frame
of the Floating is the bar's only line. The stage then fills the shell,
and the drawing shows under the bar. The root then sets
`--kata-shell-top` to the bar's height plus gap-md, the top inset of the
stage, for what lies over the stage below the bar. From 48rem the bar
keeps its place.

## Inset

`onlayout` reports, in `inset`, what the regions cover of the stage, so
that the application can keep what it draws in view (the padding of a
map's camera, say). Each side is the distance in px from that edge of
the stage to the inner edge of the region on that side.

- `left` and `right`: beside the stage, the width of the open side
  region; floating, the pane's box and the gap-md before it; as a
  sheet, 0.
- `bottom`: the height of the sheets the toolbar rises above.
- `top`: with `topFloating` on a narrow screen, the bar's box and the
  gap-md above it.

Only an open side region counts: a sheet that rests at its lowest
height (`closable: false`) does not, and neither does a closed region's
control to open it again. `bottom` leaves out the column of the toolbar
above the Fab (`bottomFab`); it is 0 from 48rem. `top` is 0 when the bar
keeps its place above the stage.

The shell measures these with a `ResizeObserver` (read in the delivery
and written in the next frame), and calls `onlayout` when the width, a
mode or the inset changes. The root also sets them as
`--kata-shell-inset-top`, `--kata-shell-inset-right`,
`--kata-shell-inset-bottom` and `--kata-shell-inset-left`, in px, for
what lies over the stage.

## Example

[Shell](../../examples/shell/)
