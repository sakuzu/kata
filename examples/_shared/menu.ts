// The menu of a drawing application, shared by the examples of the menus
import type { MenuModel } from '@sakuzu/kata/svelte';

export const appMenu: MenuModel[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New drawing', kbd: '⌘N' },
      { id: 'open', label: 'Open…', kbd: '⌘O' },
      {
        id: 'export',
        label: 'Export',
        items: [
          { id: 'export-png', label: 'Picture (PNG)' },
          { id: 'export-svg', label: 'Vector (SVG)' },
        ],
      },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { id: 'undo', label: 'Undo', kbd: '⌘Z' },
      { id: 'redo', label: 'Redo', kbd: '⇧⌘Z', disabled: true },
      { divider: true },
      { id: 'duplicate', label: 'Duplicate', kbd: '⌘D' },
      { id: 'delete', label: 'Delete…', danger: true },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { heading: 'Show' },
      { id: 'grid', label: 'Grid', checked: true },
      { id: 'rulers', label: 'Rulers', checked: false },
    ],
  },
  { divider: true },
  { id: 'shortcuts', label: 'Keyboard shortcuts', kbd: '?' },
];
