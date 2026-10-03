# LayerTree

LayerTree is the tree of the layers of a drawing and of what they hold,
with the eye, the lock, renaming in place, reordering by dragging and an
add menu.

## When to use

Use it in a panel beside the stage of a drawing application. The
application passes its layers, groups and items as nodes of one general
shape and keeps them: the tree reports what the person does, and the
application applies it to its data, from which the tree is drawn again.
The tree knows nothing of what a kind is; `row` draws a kind in its own
way. For a list with depth that is not a stack of layers, use a
[Tree](../components/tree.md) directly.

```svelte
<script>
  import { LayerTree } from '@sakuzu/kata/svelte';
  let nodes = $state([
    {
      id: 'l1', kind: 'layer', name: 'Sketch', visible: true, locked: false,
      children: [
        { id: 's1', kind: 'shape', name: 'River', visible: true, locked: false },
      ],
    },
  ]);
  let selected = $state([]);
  let expanded = $state(['l1']);
</script>

<LayerTree label="Layers" {nodes} bind:selected bind:expanded
  onvisible={(id, v) => setVisible(id, v)} onmove={(m) => move(m)} />
```

## The nodes

| Field | Description |
| --- | --- |
| `id` | Unique in the tree |
| `kind` | What the node is, in the application's words |
| `name` | The name in the row |
| `icon` | The mark before the name (a name or a component) |
| `iconColor` | The color of the mark, a CSS color |
| `visible` | Shown; a hidden node dims its row and the rows below it |
| `locked` | Locked |
| `children` | The nodes inside; with it, even empty, the node is a group |
| `eye` | `false` shows no eye on this row |
| `lock` | `false` shows no lock on this row |
| `draggable` | `false`: the row is not dragged and shows no grip |
| `selectable` | `false`: a press does not select the row |
| `eyeDisabled` | The eye cannot be pressed; the text says why, in its tooltip |
| `current` | The row is the current one: `aria-current` and a strong name |
| `data` | The application's own fields, passed through |

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `nodes` | required | The nodes at the root, `TreeNode[]` |
| `label` | required | The name of the tree and the title of its head |
| `head` | `true` | Shows the head: the title and the add menu |
| `selected` | `[]` | The ids of the selected nodes (bindable) |
| `onselect` | | Called with `(ids, { range, toggle, pressed })` |
| `expanded` | `[]` | The ids of the open groups (bindable) |
| `onexpand` | | Called with `(id, open)` |
| `onvisible` | | Shows the eye; called with `(id, visible)` |
| `onlock` | | Shows the lock; called with `(id, locked)` |
| `onrename` | | Lets a name change in place; called with `(id, name)` |
| `onmove` | | Lets the rows be dragged; called with `{ id, parentId, index }` |
| `allowNesting` | `false` | A group may go into another group |
| `canDrop` | | The application's rule: `(node, parent)` may drop |
| `gripOnly` | `false` | Rows are picked up by their grip, which always shows |
| `addMenu` | | The menu of the add button in the head, `MenuModel[]` |
| `onadd` | | Called with the id of the chosen item of `addMenu` |
| `addLabel` | "Add" | The text of the add button |
| `row` | | Draws the part before the actions: `(node, name)` |
| `actions` | | Actions of a row before the eye and the lock: `(node)` |
| `actionsAfter` | `false` | Puts `actions` after the eye and the lock |
| `subrows` | | Draws what goes under a row, before its children: `(node)` |

## Contract

The tree is a [SectionHeader](../components/section-header.md) with
`flush`, the label in its head and the add button (a
[Dropdown](../components/dropdown.md) with a
[MenuList](menu-list.md) of `addMenu`) on its right, over a
[Tree](../components/tree.md) of [TreeRow](../components/tree-row.md)s
indented by depth; `head={false}` leaves the Tree alone. A row shows the
mark (the icon in a [Markbox](../components/markbox.md), drawn as a
[Swatch](../components/swatch.md) of `iconColor` when it has one) and the
name on one line with an ellipsis; `row` replaces them and renders
`name(node)` where the name goes, so that renaming still works. On the
right come `actions`, the eye and the lock (`actions` last with
`actionsAfter`), which show on hover and focus, and always when they
are not in their default state (hidden, locked). A hidden node dims its
row and its children's rows.

Each node can change its own row. `eye: false` and `lock: false` leave
out its eye and its lock. `eyeDisabled` disables the eye and shows its
text in the eye's [Tooltip](../components/tooltip.md), to say why the
node cannot be shown or hidden. `draggable: false` keeps the row in its
place: it shows no grip, even with `gripOnly`, and is never picked up,
while the rows around it still move. `selectable: false` makes a press
select nothing, takes the row out of a range made with Shift, and leaves
out its `aria-selected`; the arrows still move the focus to it.
`current` marks the row where new things go: it has
`aria-current="true"` and its name is in the label role, at the same
size and with more weight.

`subrows(node)` draws what the application puts right under a row and
before its children, such as a line of settings of that node. It is not
a row: it spans the width of the tree, starts at the column of its
row's name, and has no grip and no selection; a press in it
neither selects nor starts a drag. Its distances are the application's.
When the `row` snippet redraws a row, a subrow starts where the row's
content starts.

A press selects the row alone; Shift adds the rows from the last one
pressed, and ⌘ or Ctrl adds or removes one row. `onselect` receives the
new selection, the keys held (`range` for Shift, `toggle` for ⌘ or
Ctrl) and the id of the row pressed (`pressed`); the application may
apply its own rule instead. Only the rows that show take part: the
children of a closed group are not read. The chevron opens and closes
a group. The up and down arrows, Home and End move between the rows;
the right arrow opens a group and then goes into it, the left one
closes it and then goes to the parent; Enter and Space press the row;
F2 or a double click renames it in place with an
[InlineEdit](../components/inline-edit.md): Enter keeps the name and
Escape restores it.

With `onmove`, the rows are reordered by dragging through
[sortable](../components/sortable.md): a group moves with its children,
a closed group that the node may enter opens after a moment under the
pointer, and a drop reports the node, its new parent (`null` at the
root) and its index among the parent's children after the move. A node
without children goes into any group. A group keeps its depth unless
`allowNesting`: it moves among its siblings and into other parents at
the same depth, and never enters another group. No node goes into
itself, and `canDrop` adds the application's own rule. The messages are
`hide`, `show`, `lock`, `unlock`, `rename` (the name of the input) and
`add`.

## Example

[LayerTree](../../examples/layer-tree/)
