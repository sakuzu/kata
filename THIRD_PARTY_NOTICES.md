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

The font tokens name typefaces (IBM Plex Sans, IBM Plex Sans JP, IBM Plex
Mono, Noto Sans SC and Noto Sans TC). The package does not bundle or load
these fonts; an application that wants them installs and loads them under
their own licenses (SIL Open Font License 1.1). Without them, the browser
falls back to the system fonts named at the end of each list.
