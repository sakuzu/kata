// The icons that the components draw on their own, by name. Each Lucide icon is imported on its own
// so that a bundle keeps only the icons in use. The drawing glyphs (point, polyline, polygon, arrow,
// sticky-note) are kata's own, drawn on the same grid, for the shapes Lucide does not have.
//
// Icon and the components that take an icon accept a name from this list or any icon component
// (a Lucide icon, or a component that accepts `class`).

import ArrowLeft from '@lucide/svelte/icons/arrow-left';
import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
import Check from '@lucide/svelte/icons/check';
import ChevronDown from '@lucide/svelte/icons/chevron-down';
import Image from '@lucide/svelte/icons/image';
import Pencil from '@lucide/svelte/icons/pencil';
import Pipette from '@lucide/svelte/icons/pipette';
import Plus from '@lucide/svelte/icons/plus';
import Search from '@lucide/svelte/icons/search';
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
  'arrow-left': ArrowLeft as unknown as IconComponent,
  'arrow-up-right': ArrowUpRight as unknown as IconComponent,
  check: Check as unknown as IconComponent,
  'chevron-down': ChevronDown as unknown as IconComponent,
  image: Image as unknown as IconComponent,
  pencil: Pencil as unknown as IconComponent,
  pipette: Pipette as unknown as IconComponent,
  plus: Plus as unknown as IconComponent,
  search: Search as unknown as IconComponent,
  x: X as unknown as IconComponent,
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
