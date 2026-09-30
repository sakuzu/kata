// The toasts on screen. ToastHost shows what the store holds; an application calls toast.show() or
// toast.error() from anywhere. Each toast removes itself after TOAST_DURATION, or earlier with
// toast.dismiss().
//
//   import { toast } from '@sakuzu/kata/svelte';
//   toast.show('Saved');
//   toast.error('The file could not be read');

export type ToastKind = 'info' | 'error';

export interface ToastItem {
  id: number;
  msg: string;
  kind: ToastKind;
}

/** How long a toast stays on screen, in milliseconds */
export const TOAST_DURATION = 3200;

let items = $state<ToastItem[]>([]);
let seq = 0;

function push(msg: string, kind: ToastKind): number {
  const id = ++seq;
  items.push({ id, msg, kind });
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
  }, TOAST_DURATION);
  return id;
}

export const toast = {
  /** The toasts on screen, oldest first */
  get items(): readonly ToastItem[] {
    return items;
  },
  /** Shows a message; information and success are neutral. Returns the toast's id. */
  show(msg: string, kind: ToastKind = 'info'): number {
    return push(msg, kind);
  },
  /** Shows a failure, with a red line. Returns the toast's id. */
  error(msg: string): number {
    return push(msg, 'error');
  },
  /** Removes a toast before its time */
  dismiss(id: number): void {
    items = items.filter((t) => t.id !== id);
  },
};
