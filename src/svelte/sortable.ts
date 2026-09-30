// sortable: a Svelte action that lets the user reorder items by dragging them, within a container
// and between containers. SortableJS handles the input (mouse, touch, nested containers); the
// action reports the result as a move from one container and index to another, and the
// application applies it to its own data. The data stays the only source of the order: right after
// a drop the action puts the element back where it was, so that a keyed {#each} is never out of
// step with the DOM, and the list is drawn again from the data.
//
// Put the action on each container. Containers with the same group exchange items. Each item
// carries data-sortable-item and data-id; data-kind names its kind when containers accept only
// some kinds. With handle, an item is picked up by that part only (a grip for touch screens);
// without it, by the whole item.
//
//   <div use:sortable={{ group: 'rows', containerId: 'root', onDrop: move }}>
//     {#each rows as row (row.id)}
//       <TreeRow data-sortable-item data-id={row.id}>{row.name}</TreeRow>
//     {/each}
//   </div>

import Sortable from 'sortablejs';

/** A drop: the item, the containers and the indexes before and after */
export interface SortMove {
  itemId: string;
  /** The id of the container the item left */
  from: string;
  /** The id of the container the item was dropped in */
  to: string;
  oldIndex: number;
  newIndex: number;
}

/** What is under the pointer during a drag */
export interface SortOver {
  dragId: string;
  dragKind: string;
  overId: string;
  overKind: string;
}

export interface SortableParams {
  /** Containers with the same group exchange items */
  group: string;
  /** The id of this container, reported in SortMove */
  containerId: string;
  /** A selector for the part that picks an item up; without it, the whole item */
  handle?: string | null;
  /** A selector for parts that never start a drag (the actions of a row); clicks go through */
  filter?: string;
  /**
   * Whether the container accepts an item of a kind (its data-kind; the second argument is its
   * data-id); without it, every item
   */
  accept?: (kind: string, id: string) => boolean;
  /** false turns the container off (read only) */
  enabled?: boolean;
  /** Called on a drop that changed the order. The DOM is already back as it was. */
  onDrop: (move: SortMove) => void;
  /**
   * Called while dragging with the item under the pointer, and with null when the drag ends.
   * Returning true holds the order still, so that the item under the pointer stays there (for
   * example to open a closed group after a moment).
   */
  onOver?: (info: SortOver | null) => boolean;
}

export function sortable(node: HTMLElement, params: SortableParams) {
  let cur = params;
  let instance: Sortable | null = null;
  // Where the item was when the drag began, to put it back after the drop
  let origParent: HTMLElement | null = null;
  let origNext: Node | null = null;
  // The item under the pointer, read from the document during a drag: SortableJS reports moves
  // only over containers that accept the item
  let docMove: ((e: PointerEvent) => void) | null = null;

  node.setAttribute('data-container', params.containerId);

  // The value of a data attribute of an element, or ''
  const data = (el: Element | null | undefined, name: string) =>
    el?.getAttribute(`data-${name}`) ?? '';

  function stopWatching() {
    if (docMove) {
      document.removeEventListener('pointermove', docMove, true);
      docMove = null;
    }
  }

  function make(): Sortable | null {
    if (cur.enabled === false) return null;
    return Sortable.create(node, {
      group: {
        name: cur.group,
        pull: true,
        put: (_to, _from, el) => (cur.accept ? cur.accept(data(el, 'kind'), data(el, 'id')) : true),
      },
      handle: cur.handle ?? undefined,
      filter: cur.filter,
      // A press on a filtered part (a button) stays a click
      preventOnFilter: false,
      draggable: '[data-sortable-item]',
      animation: 150,
      // The fallback drag behaves the same with a mouse and with touch, and keeps clicks
      forceFallback: true,
      // A smaller movement is a click, not a drag
      fallbackTolerance: 10,
      fallbackClass: 'sortfallback',
      // The classes of the item picked up, of the place it would drop and of the dragged copy
      ghostClass: 'sortghost',
      chosenClass: 'sortchosen',
      dragClass: 'sortdrag',
      scroll: true,
      scrollSensitivity: 40,
      scrollSpeed: 12,
      touchStartThreshold: 4,
      onMove(evt) {
        const dragged = evt.dragged as HTMLElement | undefined;
        const related = evt.related as HTMLElement | undefined;
        const hold = cur.onOver?.({
          dragId: data(dragged, 'id'),
          dragKind: data(dragged, 'kind'),
          overId: data(related, 'id'),
          overKind: data(related, 'kind'),
        });
        return hold !== true;
      },
      onStart(evt) {
        origParent = evt.from;
        origNext = evt.item.nextSibling;
        const dragId = data(evt.item, 'id');
        const dragKind = data(evt.item, 'kind');
        docMove = (e: PointerEvent) => {
          const el = document.elementFromPoint?.(e.clientX, e.clientY) as HTMLElement | null;
          const over = el?.closest<HTMLElement>('[data-sortable-item]');
          const overId = data(over, 'id');
          const self = overId === dragId;
          cur.onOver?.({
            dragId,
            dragKind,
            overId: self ? '' : overId,
            overKind: self ? '' : data(over, 'kind'),
          });
        };
        document.addEventListener('pointermove', docMove, true);
      },
      onEnd(evt) {
        stopWatching();
        const item = evt.item;
        const oldIndex = evt.oldIndex ?? 0;
        const newIndex = evt.newIndex ?? 0;
        // Put the element back; the application's data decides the order
        if (origParent) origParent.insertBefore(item, origNext);
        origParent = null;
        origNext = null;
        cur.onOver?.(null);
        const from = data(evt.from, 'container');
        const to = data(evt.to, 'container');
        const itemId = data(item, 'id');
        if (!itemId || !from || !to) return;
        if (from === to && oldIndex === newIndex) return;
        cur.onDrop({ itemId, from, to, oldIndex, newIndex });
      },
    });
  }

  instance = make();

  return {
    update(p: SortableParams) {
      const remake =
        p.group !== cur.group ||
        p.handle !== cur.handle ||
        p.enabled !== cur.enabled ||
        p.containerId !== cur.containerId;
      cur = p;
      node.setAttribute('data-container', p.containerId);
      if (remake) {
        instance?.destroy();
        instance = make();
      }
    },
    destroy() {
      stopWatching();
      instance?.destroy();
      instance = null;
    },
  };
}
