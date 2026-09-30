import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import ProcessDialog from '../../src/svelte/components/ProcessDialog.svelte';
import SourcePicker, { type PickerSource } from '../../src/svelte/components/SourcePicker.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

// jsdom has no showModal() or close(); these do what a browser does with the open attribute and
// the close event
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

const settle = async () => {
  await tick();
  await tick();
};

describe('ProcessDialog', () => {
  it('runs with the run action and shows the description and the fields', async () => {
    const onrun = vi.fn();
    const { getByRole, getByText } = render(ProcessDialog, {
      open: true,
      title: 'Simplify',
      description: 'Removes points.',
      runLabel: 'Simplify',
      onrun,
      children: html('<label>Tolerance <input /></label>'),
    });
    await settle();
    expect(getByText('Removes points.')).toBeTruthy();
    expect(getByRole('textbox', { name: 'Tolerance' })).toBeTruthy();
    await fireEvent.click(getByRole('button', { name: 'Simplify' }));
    expect(onrun).toHaveBeenCalledOnce();
  });

  it('cancels and closes with the cancel action', async () => {
    const oncancel = vi.fn();
    const { container, getByRole } = render(ProcessDialog, {
      open: true,
      title: 'Simplify',
      oncancel,
    });
    await settle();
    await fireEvent.click(getByRole('button', { name: 'Cancel' }));
    await settle();
    expect(oncancel).toHaveBeenCalledOnce();
    expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false);
  });

  it('cancels when closed with the close button', async () => {
    const oncancel = vi.fn();
    const { getByRole } = render(ProcessDialog, { open: true, title: 'Simplify', oncancel });
    await settle();
    await fireEvent.click(getByRole('button', { name: 'Close' }));
    await settle();
    expect(oncancel).toHaveBeenCalledOnce();
  });

  it('does not cancel when the application closes it', async () => {
    const oncancel = vi.fn();
    const { container, rerender } = render(ProcessDialog, {
      open: true,
      title: 'Simplify',
      oncancel,
    });
    await settle();
    await rerender({ open: false });
    await settle();
    expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(oncancel).not.toHaveBeenCalled();
  });

  it('shows the progress while running and makes the run action busy', async () => {
    const { getByRole, getByText, queryByText } = render(ProcessDialog, {
      open: true,
      title: 'Export',
      description: 'Exports every page.',
      running: true,
      progress: 40,
      runningText: 'Exporting',
    });
    await settle();
    expect(queryByText('Exports every page.')).toBeNull();
    expect(getByText('Exporting')).toBeTruthy();
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('40');
    expect((getByRole('button', { name: 'Run' }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('SourcePicker', () => {
  const sources: PickerSource[] = [
    { id: 'device', label: 'This device', description: 'A file' },
    { id: 'link', label: 'Link' },
  ];
  const detail = createRawSnippet((source: () => PickerSource) => ({
    render: () => `<p>Detail of ${source().label}</p>`,
  }));

  it('lists the places, marks the current one and draws its detail', async () => {
    const { getByText, getByRole } = render(SourcePicker, {
      open: true,
      title: 'Add',
      sources,
      current: 'link',
      detail,
    });
    await settle();
    expect(getByRole('navigation', { name: 'Add' })).toBeTruthy();
    expect(getByText('Link').closest('[role="button"]')?.getAttribute('aria-current')).toBe('true');
    expect(getByText('Detail of Link')).toBeTruthy();
  });

  it('reports the place that is pressed, and follows current', async () => {
    const onpick = vi.fn();
    const { getByText, rerender } = render(SourcePicker, {
      open: true,
      title: 'Add',
      sources,
      current: 'link',
      onpick,
      detail,
    });
    await settle();
    await fireEvent.click(getByText('This device'));
    expect(onpick).toHaveBeenCalledWith('device');
    await rerender({ current: 'device' });
    const item = getByText('This device').closest('[role="button"]');
    expect(item?.getAttribute('aria-current')).toBe('true');
  });

  it('closes with the close action in the Footer', async () => {
    const onclose = vi.fn();
    const { getAllByRole, container } = render(SourcePicker, {
      open: true,
      title: 'Add',
      sources,
      current: 'device',
      detail,
      onclose,
    });
    await settle();
    // The Footer's Close, after the head's close button
    const closes = getAllByRole('button', { name: 'Close' });
    await fireEvent.click(closes[closes.length - 1]);
    await settle();
    expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(onclose).toHaveBeenCalledOnce();
  });
});
