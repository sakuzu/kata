import type { Attachment } from 'svelte/attachments';

// Which edges of a container that scrolls sideways still have content beyond them. The attachment
// sets data-overflow-start while the content reaches past the start edge (scrollLeft > 0) and
// data-overflow-end while it reaches past the end edge, and the container's style draws a mark at
// those edges (the overflow-edges mixin of kata.scss). It reads on scroll and when the container
// or its content changes size, and writes in the next animation frame.
//
//   <div class="scroller" {@attach overflowEdges()}>…</div>
//
// It is no longer the sign that a region scrolls: every region shows its scrollbar (the base CSS),
// and no component uses it. It stays exported until the next major version, which removes it.

/** Marks the edges of a sideways scroller that have content beyond them */
export function overflowEdges(): Attachment<HTMLElement> {
  return (el) => {
    let start = false;
    let end = false;
    let frame = 0;
    const write = () => {
      frame = 0;
      el.toggleAttribute('data-overflow-start', start);
      el.toggleAttribute('data-overflow-end', end);
    };
    const read = () => {
      start = el.scrollLeft > 0;
      // One pixel of room for rounding
      end = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      if (!frame) frame = requestAnimationFrame(write);
    };
    read();
    el.addEventListener('scroll', read, { passive: true });
    // The container's own size, and the size of what it holds
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(read);
    if (ro) {
      ro.observe(el);
      for (const child of el.children) ro.observe(child);
    }
    return () => {
      el.removeEventListener('scroll', read);
      ro?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.removeAttribute('data-overflow-start');
      el.removeAttribute('data-overflow-end');
    };
  };
}
