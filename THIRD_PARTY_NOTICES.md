# Third-party notices

`@sakuzu/kata` is distributed under the Apache License, Version 2.0 (see
`LICENSE` and `NOTICE`). This file lists the third-party software that the
package includes or depends on at run time, with its license.

The package includes no third-party code. Its Svelte entry has these
run-time dependencies, which are installed with it:

- [Lucide](https://lucide.dev) (`@lucide/svelte`), the icons, under the
  ISC License.
- [SortableJS](https://github.com/SortableJS/Sortable) (`sortablejs`),
  the dragging of the `sortable` action, under the MIT License.

[Svelte](https://svelte.dev) (`svelte`, MIT License) is a peer
dependency: the application that uses the Svelte entry installs it. The
drawing glyphs (point, polyline, polygon, arrow and sticky note) are
kata's own.

The sans font token names typefaces (IBM Plex Sans, IBM Plex Sans JP,
Noto Sans SC and Noto Sans TC). The package does not bundle or load these
fonts; an application that wants them installs and loads them under their
own licenses (SIL Open Font License 1.1). Without them, the browser falls
back to the system font named at the end of the list. The monospace font
token names only fonts of the operating systems.
