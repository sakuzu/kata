import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import Shell, { type ShellLayout } from '../../src/svelte/components/Shell.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));
const regions = {
  top: html('<header>Bar</header>'),
  left: html('<section>Contents</section>'),
  right: html('<section>Details</section>'),
  stage: html('<div>Drawing</div>'),
};

// jsdom has no ResizeObserver, which the measured heights need
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

/** Resizes the window (in px, at a root of 16px) and lets the shell measure again */
async function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
  await tick();
  await tick();
}

const region = (el: HTMLElement, name: string) => el.querySelector(`[data-region="${name}"]`);

describe('Shell', () => {
  afterEach(() => resize(1024));

  it('draws the regions it is given and leaves out the others', async () => {
    const { container } = render(Shell, { ...regions, right: undefined });
    await tick();
    expect(container.querySelector('.top')?.textContent).toBe('Bar');
    expect(region(container, 'left')?.textContent).toBe('Contents');
    expect(container.querySelector('.surface')?.textContent).toBe('Drawing');
    expect(region(container, 'right')).toBeNull();
    expect(region(container, 'bottom')).toBeNull();
    expect(region(container, 'dock')).toBeNull();
  });

  it('draws the dock under the stage, with a grip along its top', async () => {
    const { getByRole } = render(Shell, { stage: regions.stage, dock: html('<div>Output</div>') });
    await tick();
    const grip = getByRole('slider', { name: 'Dock height' });
    expect(grip.closest('[data-region="dock"]')?.textContent?.trim()).toBe('Output');
  });

  it('opens and closes the side regions with leftOpen and rightOpen', async () => {
    const { container, rerender } = render(Shell, { ...regions, leftOpen: false });
    await tick();
    expect(region(container, 'left')).toBeNull();
    expect(region(container, 'right')).toBeNull();
    await rerender({ leftOpen: true, rightOpen: true });
    await tick();
    expect(region(container, 'left')).not.toBeNull();
    expect(region(container, 'right')).not.toBeNull();
  });

  it('puts the side regions beside, floating or in sheets by the width', async () => {
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container } = render(Shell, { ...regions, rightOpen: true, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'wide',
      leftMode: 'beside',
      rightMode: 'beside',
    });
    expect(container.querySelector('.side.left')).not.toBeNull();

    // 60rem: between the narrow and the medium width
    await resize(960);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'mid',
      leftMode: 'floating',
      rightMode: 'floating',
    });
    expect(container.querySelectorAll('[data-role="floating"]')).toHaveLength(2);
    expect(container.querySelector('.scrim')).not.toBeNull();
    expect(container.querySelector('.side')).toBeNull();

    // 30rem: below the narrow width
    await resize(480);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'narrow',
      leftMode: 'sheet',
      rightMode: 'sheet',
    });
    expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
    expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
  });

  it('closes the floating panes when the scrim is pressed', async () => {
    await resize(960);
    const { container, getByRole } = render(Shell, { ...regions, rightOpen: true });
    await tick();
    await fireEvent.click(getByRole('button', { name: 'Close the panels' }));
    await tick();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
  });
});
