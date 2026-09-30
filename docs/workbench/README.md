# Workbench

The workbench is the parts of a drawing application: the layer tree, the
menus, the comments and the rest. They are built from the
[components](../components/README.md) and are published in
`@sakuzu/kata/svelte` with them. Each part takes the application's data
in one general shape and its content through props and snippets; it
knows nothing of what is drawn, and it reports what the person does for
the application to apply.

Each page below describes one part: what it is, when to use it, its
props, its contract (its boundary with the application, its keys and
its states) and a live example.

## Layers

- [LayerTree](layer-tree.md): the layers, groups and items of a drawing,
  with the eye, the lock, renaming in place, reordering by dragging and
  an add menu.

## Menus

- [MenuList](menu-list.md): a menu drawn from its model (`MenuModel`),
  with submenus.
- [AppMenu](app-menu.md): the menu of the application behind one button.
- [MenuSheet](menu-sheet.md): the same menu in a sheet on a narrow
  screen.

## Comments

- [CommentList](comment-list.md): the threads of a document, with their
  replies, to open and resolve.
- [CommentComposer](comment-composer.md): where a comment or a reply is
  written.
