import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { describe, expect, it } from 'vitest';
import Sheet from '../../src/svelte/components/Sheet.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

describe('Sheet', () => {
  // jsdom lays nothing out: the frame is 800px high and the sheet at half is as high as its short
  // content (160px), as a browser would measure them
  it('never snaps to a lower stage after a drag that ends above where it started', async () => {
    const { container } = render(Sheet, {
      stage: 'half',
      label: 'Details',
      children: html('<p>Content</p>'),
    });
    const sheet = container.querySelector<HTMLElement>('aside.sheet');
    const handle = sheet?.querySelector<HTMLElement>('.handle');
    if (!sheet || !handle) throw new Error('no sheet');
    Object.defineProperty(container, 'clientHeight', { configurable: true, value: 800 });
    sheet.getBoundingClientRect = () => ({ height: 160 }) as DOMRect;

    // A short drag up: 180px is nearer peek than half, but it ended above where it started
    await fireEvent.pointerDown(handle, { clientY: 700 });
    await fireEvent.pointerMove(handle, { clientY: 680 });
    await fireEvent.pointerUp(handle, { clientY: 680 });
    // The click a browser sends after the drag does not step
    await fireEvent.click(handle, { detail: 1 });
    await tick();
    expect(sheet.getAttribute('data-stage')).toBe('half');

    // A long drag up snaps to full, and the click after it does not step back to peek
    await fireEvent.pointerDown(handle, { clientY: 700 });
    await fireEvent.pointerMove(handle, { clientY: 100 });
    await fireEvent.pointerUp(handle, { clientY: 100 });
    await fireEvent.click(handle, { detail: 1 });
    await tick();
    expect(sheet.getAttribute('data-stage')).toBe('full');

    // A press without a drag still steps (from the highest back to the lowest)
    await fireEvent.pointerDown(handle, { clientY: 700 });
    await fireEvent.pointerUp(handle, { clientY: 700 });
    await fireEvent.click(handle, { detail: 1 });
    await tick();
    expect(sheet.getAttribute('data-stage')).toBe('peek');
  });
});
