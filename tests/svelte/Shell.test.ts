import { render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { beforeAll, describe, expect, it } from 'vitest';
import Shell from '../../src/svelte/components/Shell.svelte';

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

const region = (el: HTMLElement, name: string) => el.querySelector(`[data-region="${name}"]`);

describe('Shell', () => {
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
});
