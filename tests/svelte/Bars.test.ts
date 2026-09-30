import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Bars from '../../src/svelte/components/Bars.svelte';

describe('Bars', () => {
  it('fits the tallest bin to the height and places the breaks', () => {
    const { container } = render(Bars, { bins: [2, 8, 4, 0], marks: [0.25, 0.7] });
    const heights = [...container.querySelectorAll('.bars i')].map(
      (b) => (b as HTMLElement).style.height,
    );
    expect(heights).toEqual(['25%', '100%', '50%', '0%']);
    const breaks = [...container.querySelectorAll('.brk')].map(
      (b) => (b as HTMLElement).style.left,
    );
    expect(breaks).toEqual(['25%', '70%']);
  });

  it('draws an empty sample flat, and is hidden from assistive technology', () => {
    const { container } = render(Bars, { bins: [0, 0] });
    expect((container.querySelector('.bars i') as HTMLElement).style.height).toBe('0%');
    expect(container.querySelector('.chart')?.getAttribute('aria-hidden')).toBe('true');
  });
});
