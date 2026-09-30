// The model of a menu: the items, the dividers and the headings of a menu as data. MenuList draws
// it, and AppMenu, MenuSheet, Kebab, Topbar and LayerTree take it, so that one description of a
// menu serves a button, a bar and a sheet on a narrow screen. An item with items opens a submenu.
//
//   const menu: MenuModel[] = [
//     { id: 'new', label: 'New', kbd: '⌘N' },
//     { id: 'arrange', label: 'Arrange', items: [{ id: 'front', label: 'Bring to front' }] },
//     { divider: true },
//     { heading: 'View' },
//     { id: 'grid', label: 'Grid', checked: true },
//   ];
import type { IconSource } from '../icons.js';

/** One item of a menu; with items it opens a submenu */
export interface MenuModelItem {
  /** Reported when the item is chosen */
  id: string;
  label: string;
  /** A key hint at the right end */
  kbd?: string;
  /** An icon on the left */
  icon?: IconSource;
  /** Shown but not chosen */
  disabled?: boolean;
  /** A check mark on the left; the items of the same level keep the column of check marks */
  checked?: boolean;
  /** A destructive action: red text */
  danger?: boolean;
  /** A link: the item goes there instead of reporting its id */
  href?: string;
  /** The items of a submenu */
  items?: MenuModel[];
}

/** An item, a divider or the heading of a group */
export type MenuModel = MenuModelItem | { divider: true } | { heading: string };

/** Whether an entry of a menu is an item */
export function isMenuItem(entry: MenuModel): entry is MenuModelItem {
  return 'id' in entry;
}
