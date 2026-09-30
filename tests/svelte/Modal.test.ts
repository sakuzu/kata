import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import Confirm from '../../src/svelte/components/Confirm.svelte';
import Drawer from '../../src/svelte/components/Drawer.svelte';
import Modal from '../../src/svelte/components/Modal.svelte';
import { setMessages } from '../../src/svelte/messages.js';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

// jsdom has no showModal() or close(). These do what a browser does with the open attribute and the
// close event; pressEscape() fires cancel and closes unless it is prevented, as a browser does.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
  proto.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  proto.close ??= function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

function pressEscape(dialog: HTMLDialogElement) {
  const cancel = new Event('cancel', { cancelable: true });
  dialog.dispatchEvent(cancel);
  if (!cancel.defaultPrevented) dialog.close();
}

const settle = async () => {
  await tick();
  await tick();
};

describe('Modal', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('opens as a modal dialog and focuses the first input of the body', async () => {
    const { container } = render(Modal, {
      open: true,
      title: 'New document',
      children: html('<input aria-label="Name" />'),
      primary: html('<button>Create</button>'),
    });
    await settle();
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.getAttribute('role')).toBe('dialog');
    const title = container.querySelector('h2');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(title?.textContent).toBe('New document');
    await vi.waitFor(() => expect(document.activeElement?.getAttribute('aria-label')).toBe('Name'));
  });

  it('focuses the primary action when the body has no input', async () => {
    render(Modal, {
      open: true,
      title: 'Share',
      children: html('<p>Everyone in the team can open it.</p>'),
      cancel: html('<button>Cancel</button>'),
      primary: html('<button>Share</button>'),
    });
    await settle();
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Share'));
  });

  it('closes on Escape and calls onclose once', async () => {
    const onclose = vi.fn();
    const { container } = render(Modal, {
      open: true,
      title: 'Settings',
      onclose,
      children: html('<p>Body</p>'),
    });
    await settle();
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    pressEscape(dialog);
    await settle();
    expect(dialog.hasAttribute('open')).toBe(false);
    expect(onclose).toHaveBeenCalledOnce();
  });

  it('closes from its close button, named by the messages', async () => {
    setMessages({ close: 'Schließen' });
    const onclose = vi.fn();
    const { container, getByRole } = render(Modal, {
      open: true,
      title: 'Settings',
      onclose,
      children: html('<p>Body</p>'),
    });
    await settle();
    await fireEvent.click(getByRole('button', { name: 'Schließen' }));
    await settle();
    expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(onclose).toHaveBeenCalledOnce();
  });

  it('cannot be closed with Escape when persistent, and has no close button', async () => {
    const onclose = vi.fn();
    const { container, queryByRole } = render(Modal, {
      open: true,
      title: 'Access removed',
      persistent: true,
      onclose,
      children: html('<p>Body</p>'),
      primary: html('<button>Leave</button>'),
    });
    await settle();
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
    pressEscape(dialog);
    await settle();
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(onclose).not.toHaveBeenCalled();
  });

  it('draws the same surface in the flow when inline', () => {
    const { container } = render(Modal, {
      inline: true,
      title: 'New document',
      children: html('<p>Body</p>'),
    });
    expect(container.querySelector('dialog')).toBeNull();
    expect(container.querySelector('[data-role="modal"][data-inline]')).not.toBeNull();
  });
});

describe('Confirm', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('is an alert dialog that focuses cancel first', async () => {
    const { container } = render(Confirm, {
      open: true,
      title: 'Delete 4 items?',
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onconfirm: () => {},
    });
    await settle();
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.textContent).toContain('This cannot be undone.');
    await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('Cancel'));
  });

  it('reports a confirmation without a cancel, and stays open', async () => {
    const onconfirm = vi.fn();
    const oncancel = vi.fn();
    const { container, getByRole } = render(Confirm, {
      open: true,
      title: 'Publish?',
      onconfirm,
      oncancel,
    });
    await settle();
    await fireEvent.click(getByRole('button', { name: 'Confirm' }));
    expect(onconfirm).toHaveBeenCalledOnce();
    const dialog = container.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.hasAttribute('open')).toBe(true);
    dialog.close();
    await settle();
    expect(oncancel).not.toHaveBeenCalled();
  });

  it('reports a cancel once, from the cancel button or Escape', async () => {
    setMessages({ cancel: 'Abbrechen' });
    const oncancel = vi.fn();
    const first = render(Confirm, {
      open: true,
      title: 'Delete?',
      confirmLabel: 'Delete',
      onconfirm: () => {},
      oncancel,
    });
    await settle();
    await fireEvent.click(first.getByRole('button', { name: 'Abbrechen' }));
    await settle();
    expect(oncancel).toHaveBeenCalledOnce();
    first.unmount();

    const second = render(Confirm, {
      open: true,
      title: 'Delete?',
      confirmLabel: 'Delete',
      onconfirm: () => {},
      oncancel,
    });
    await settle();
    pressEscape(second.container.querySelector('dialog') as HTMLDialogElement);
    await settle();
    expect(oncancel).toHaveBeenCalledTimes(2);
  });

  it('cannot be confirmed while busy', async () => {
    const { getByRole } = render(Confirm, {
      open: true,
      title: 'Delete?',
      confirmLabel: 'Delete',
      busy: true,
      onconfirm: () => {},
    });
    await settle();
    expect((getByRole('button', { name: 'Delete' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('Drawer', () => {
  it('closes on Escape and on a press on the scrim', async () => {
    const onclose = vi.fn();
    const { container, queryByRole } = render(Drawer, {
      open: true,
      label: 'Navigation',
      onclose,
      children: html('<p>Items</p>'),
    });
    expect(container.querySelector('aside')?.getAttribute('aria-label')).toBe('Navigation');
    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onclose).toHaveBeenCalledOnce();
    expect(queryByRole('complementary')).toBeNull();

    const again = render(Drawer, { open: true, onclose, children: html('<p>Items</p>') });
    await fireEvent.click(again.getByRole('button', { name: 'Close' }));
    expect(onclose).toHaveBeenCalledTimes(2);
  });
});
