// Which items of a bar of equal buttons fit in a width. The items are in groups: the buttons of a
// group are itemGap apart and the groups groupGap apart. When the items do not all fit, a button
// for the rest ("More") takes a group of its own at the end, the item at `keep` always shows, and
// the others show from the start as long as they fit.

export interface BarMetrics {
  /** The width of one button */
  button: number;
  /** The distance between the buttons of a group */
  itemGap: number;
  /** The distance between groups */
  groupGap: number;
  /** The padding and the lines at the two ends of the bar */
  chrome: number;
  /** The width the bar may take */
  available: number;
}

/** The width of a bar that shows the given items, with or without the button for the rest */
export function barWidth(groups: number[], shown: Iterable<number>, m: BarMetrics, more: boolean) {
  const counts = new Map<number, number>();
  for (const i of shown) counts.set(groups[i], (counts.get(groups[i]) ?? 0) + 1);
  let width = m.chrome;
  let n = 0;
  for (const count of counts.values()) {
    width += count * m.button + (count - 1) * m.itemGap;
    n += 1;
  }
  if (more) {
    width += m.button;
    n += 1;
  }
  return width + Math.max(0, n - 1) * m.groupGap;
}

/**
 * The indexes of the items that show, in order, or null when all of them fit.
 * @param groups the group of each item, in order
 * @param keep the index of the item that always shows, or -1
 */
export function fitBar(groups: number[], keep: number, m: BarMetrics): number[] | null {
  const all = groups.map((_, i) => i);
  // Half a pixel of room for rounding
  const room = m.available + 0.5;
  if (barWidth(groups, all, m, false) <= room) return null;
  const chosen = new Set<number>();
  if (keep >= 0 && keep < groups.length) chosen.add(keep);
  for (const i of all) {
    if (chosen.has(i)) continue;
    if (barWidth(groups, [...chosen, i], m, true) > room) break;
    chosen.add(i);
  }
  return [...chosen].sort((a, b) => a - b);
}
