import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Progress from '../../src/svelte/components/Progress.svelte';

describe('Progress', () => {
  it('fills up to the value, out of 100 by default', () => {
    const { container, getByRole } = render(Progress, { value: 38 });
    expect((container.querySelector('.fill') as HTMLElement).style.width).toBe('38%');
    expect(getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38');
  });

  it('takes another maximum and stops at the ends', () => {
    const a = render(Progress, { value: 3, max: 8 });
    expect((a.container.querySelector('.fill') as HTMLElement).style.width).toBe('37.5%');
    const b = render(Progress, { value: 12, max: 8 });
    expect((b.container.querySelector('.fill') as HTMLElement).style.width).toBe('100%');
  });

  it('is indeterminate without a value: no value for assistive technology', () => {
    const { getByRole } = render(Progress, { label: 'Uploading' });
    const bar = getByRole('progressbar', { name: 'Uploading' });
    expect(bar.classList.contains('indet')).toBe(true);
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
  });
});
