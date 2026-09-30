import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Slider from '../../src/svelte/components/Slider.svelte';

describe('Slider', () => {
  it('shows the number, or the display text, on the right', () => {
    const plain = render(Slider, { value: 40, ariaLabel: 'Opacity' });
    expect(plain.container.querySelector('.val')?.textContent).toBe('40');
    const shown = render(Slider, { value: 40, display: '40%', ariaLabel: 'Size' });
    expect(shown.container.querySelector('.val')?.textContent).toBe('40%');
  });

  it('fills the track up to the value', () => {
    const { getByRole } = render(Slider, { value: 25, min: 0, max: 50, ariaLabel: 'Opacity' });
    const input = getByRole('slider') as HTMLInputElement;
    expect(input.style.getPropertyValue('--kata-slider-fill')).toBe('50%');
  });

  it('reports numbers while dragging and when let go', async () => {
    const oninput = vi.fn();
    const onchange = vi.fn();
    const { getByRole } = render(Slider, { value: 10, oninput, onchange, ariaLabel: 'Opacity' });
    const input = getByRole('slider') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '30' } });
    expect(oninput).toHaveBeenCalledWith(30);
    await fireEvent.change(input, { target: { value: '35' } });
    expect(onchange).toHaveBeenCalledWith(35);
  });
});
