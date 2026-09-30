import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Meter from '../../src/svelte/components/Meter.svelte';

const fill = (c: HTMLElement) => (c.querySelector('.fill') as HTMLElement).style.width;

describe('Meter', () => {
  it('fills the bar with the share of the limit that is used', () => {
    const { container, getByRole } = render(Meter, { value: 120, max: 480, label: 'Storage' });
    expect(fill(container)).toBe('25%');
    const bar = getByRole('meter', { name: 'Storage' });
    expect(bar.getAttribute('aria-valuenow')).toBe('120');
    expect(bar.getAttribute('aria-valuemax')).toBe('480');
  });

  it('stops at the ends: over the limit is full, below zero and a limit of 0 are empty', () => {
    expect(fill(render(Meter, { value: 22, max: 20 }).container)).toBe('100%');
    expect(fill(render(Meter, { value: -3, max: 20 }).container)).toBe('0%');
    expect(fill(render(Meter, { value: 5, max: 0 }).container)).toBe('0%');
  });

  it('shows the name and the amount, and colours the amount by tone', () => {
    const { container } = render(Meter, {
      value: 17,
      max: 20,
      tone: 'warn',
      label: 'Storage',
      text: '17 of 20 GB',
    });
    expect(container.querySelector('.k')?.textContent).toBe('Storage');
    const v = container.querySelector('.v');
    expect(v?.textContent).toBe('17 of 20 GB');
    expect(v?.classList.contains('warn')).toBe(true);
  });

  it('has no head without a name or an amount', () => {
    const { container } = render(Meter, { value: 1, max: 2 });
    expect(container.querySelector('.head')).toBeNull();
  });
});
