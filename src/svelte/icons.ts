// The icons that the components draw on their own, by name. Each Lucide icon is imported on its own
// so that a bundle keeps only the icons in use. The drawing glyphs (point, polyline, polygon, arrow,
// sticky-note) are kata's own, drawn on the same grid, for the shapes Lucide does not have.
//
// Icon and the components that take an icon accept a name from this list or any icon component
// (a Lucide icon, or a component that accepts `class`).

import ArrowDown from '@lucide/svelte/icons/arrow-down';
import ArrowLeft from '@lucide/svelte/icons/arrow-left';
import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
import Check from '@lucide/svelte/icons/check';
import ChevronDown from '@lucide/svelte/icons/chevron-down';
import ChevronLeft from '@lucide/svelte/icons/chevron-left';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import CircleAlert from '@lucide/svelte/icons/circle-alert';
import CircleCheck from '@lucide/svelte/icons/circle-check';
import Copy from '@lucide/svelte/icons/copy';
import CornerUpRight from '@lucide/svelte/icons/corner-up-right';
import Ellipsis from '@lucide/svelte/icons/ellipsis';
import Eye from '@lucide/svelte/icons/eye';
import EyeOff from '@lucide/svelte/icons/eye-off';
import Funnel from '@lucide/svelte/icons/funnel';
import Globe from '@lucide/svelte/icons/globe';
import GripVertical from '@lucide/svelte/icons/grip-vertical';
import Image from '@lucide/svelte/icons/image';
import Info from '@lucide/svelte/icons/info';
import Lock from '@lucide/svelte/icons/lock';
import LockOpen from '@lucide/svelte/icons/lock-open';
import Pencil from '@lucide/svelte/icons/pencil';
import Pipette from '@lucide/svelte/icons/pipette';
import Plus from '@lucide/svelte/icons/plus';
import Search from '@lucide/svelte/icons/search';
import Settings2 from '@lucide/svelte/icons/settings-2';
import Share2 from '@lucide/svelte/icons/share-2';
import Trash2 from '@lucide/svelte/icons/trash-2';
import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
import Undo2 from '@lucide/svelte/icons/undo-2';
import Ungroup from '@lucide/svelte/icons/ungroup';
import X from '@lucide/svelte/icons/x';
import type { Component } from 'svelte';
import Arrow from './glyphs/Arrow.svelte';
import Point from './glyphs/Point.svelte';
import Polygon from './glyphs/Polygon.svelte';
import Polyline from './glyphs/Polyline.svelte';
import StickyNote from './glyphs/StickyNote.svelte';

/** A component that draws an icon: an SVG sized by the class it receives */
export type IconComponent = Component<{ class?: string }>;

export const icons = {
  'arrow-down': ArrowDown as unknown as IconComponent,
  'arrow-left': ArrowLeft as unknown as IconComponent,
  'arrow-up-right': ArrowUpRight as unknown as IconComponent,
  check: Check as unknown as IconComponent,
  'chevron-down': ChevronDown as unknown as IconComponent,
  'chevron-left': ChevronLeft as unknown as IconComponent,
  'chevron-right': ChevronRight as unknown as IconComponent,
  'circle-alert': CircleAlert as unknown as IconComponent,
  'circle-check': CircleCheck as unknown as IconComponent,
  copy: Copy as unknown as IconComponent,
  'corner-up-right': CornerUpRight as unknown as IconComponent,
  ellipsis: Ellipsis as unknown as IconComponent,
  funnel: Funnel as unknown as IconComponent,
  globe: Globe as unknown as IconComponent,
  'grip-vertical': GripVertical as unknown as IconComponent,
  image: Image as unknown as IconComponent,
  info: Info as unknown as IconComponent,
  pencil: Pencil as unknown as IconComponent,
  pipette: Pipette as unknown as IconComponent,
  plus: Plus as unknown as IconComponent,
  search: Search as unknown as IconComponent,
  'settings-2': Settings2 as unknown as IconComponent,
  'share-2': Share2 as unknown as IconComponent,
  'trash-2': Trash2 as unknown as IconComponent,
  'triangle-alert': TriangleAlert as unknown as IconComponent,
  ungroup: Ungroup as unknown as IconComponent,
  x: X as unknown as IconComponent,
  eye: Eye as unknown as IconComponent,
  'eye-off': EyeOff as unknown as IconComponent,
  lock: Lock as unknown as IconComponent,
  'lock-open': LockOpen as unknown as IconComponent,
  'undo-2': Undo2 as unknown as IconComponent,
  point: Point as IconComponent,
  polyline: Polyline as IconComponent,
  polygon: Polygon as IconComponent,
  arrow: Arrow as IconComponent,
  'sticky-note': StickyNote as IconComponent,
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof icons;

/** A name from the list, or an icon component */
export type IconSource = IconName | IconComponent;

/** The component for a name or a component */
export function iconComponent(source: IconSource): IconComponent {
  return typeof source === 'string' ? icons[source] : source;
}
