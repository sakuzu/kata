import { render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Tooltip from '../../src/svelte/components/Tooltip.svelte';
import { hostOf } from '../../src/svelte/lib/host.js';
import { tipHost, tokenPx } from '../../src/svelte/lib/tipPlace.js';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

/** Builds a tree of elements from markup, in the body, and returns a lookup by id */
function page(markup: string) {
  const wrap = document.createElement('div');
  wrap.innerHTML = markup;
  document.body.append(wrap);
  return {
    get: (id: string) => wrap.querySelector(`#${id}`) as HTMLElement,
    remove: () => wrap.remove(),
  };
}

describe('hostOf', () => {
  it('is the body without an embedded root, and for nothing', () => {
    const p = page('<div><span id="a"></span></div>');
    expect(hostOf(p.get('a'))).toBe(document.body);
    expect(hostOf()).toBe(document.body);
    expect(hostOf(null)).toBe(document.body);
    p.remove();
  });

  it('is the nearest element with data-kata-root, the element itself included', () => {
    const p = page(
      '<div id="outer" data-kata-root><div id="inner" data-kata-root><span id="a"></span></div><span id="b"></span></div>',
    );
    expect(hostOf(p.get('a'))).toBe(p.get('inner'));
    expect(hostOf(p.get('b'))).toBe(p.get('outer'));
    expect(hostOf(p.get('inner'))).toBe(p.get('inner'));
    p.remove();
  });
});

describe('tipHost', () => {
  it('is the host, or an open dialog inside it', () => {
    const p = page(
      '<div id="root" data-kata-root><span id="a"></span><dialog id="d" open><span id="b"></span></dialog></div>',
    );
    expect(tipHost(p.get('a'))).toBe(p.get('root'));
    expect(tipHost(p.get('b'))).toBe(p.get('d'));
    p.remove();
  });

  it('is a root inside an open dialog rather than the dialog', () => {
    const p = page(
      '<dialog id="d" open><div id="root" data-kata-root><span id="a"></span></div></dialog>',
    );
    expect(tipHost(p.get('a'))).toBe(p.get('root'));
    p.remove();
  });

  it('is an open dialog in the body without a root', () => {
    const p = page('<dialog id="d" open><span id="a"></span></dialog>');
    expect(tipHost(p.get('a'))).toBe(p.get('d'));
    p.remove();
  });
});

describe('tokenPx', () => {
  it('measures inside the host, where the tokens are defined', () => {
    const p = page('<div id="root" data-kata-root><span id="a"></span></div>');
    const root = p.get('root');
    const into = vi.spyOn(root, 'appendChild');
    const body = vi.spyOn(document.body, 'appendChild');
    tokenPx('--kata-gap-sm', p.get('a'));
    expect(into).toHaveBeenCalledOnce();
    expect(body).not.toHaveBeenCalled();
    expect(root.children).toHaveLength(1);
    vi.restoreAllMocks();
    p.remove();
  });
});

describe('Tooltip in an embedded root', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('appends the tip to the root, not to the body', async () => {
    const root = document.createElement('div');
    root.setAttribute('data-kata-root', '');
    document.body.append(root);
    const { container } = render(Tooltip, {
      target: root,
      props: { text: 'Undo', children: html('<button aria-label="Undo">U</button>') },
    });
    const seat = container.querySelector('.seat') as HTMLElement;
    seat.dispatchEvent(new PointerEvent('pointerenter'));
    vi.advanceTimersByTime(400);
    await tick();
    const tip = root.querySelector<HTMLElement>(':scope > .tip');
    expect(tip?.textContent).toContain('Undo');
    expect(document.body.querySelector(':scope > .tip')).toBeNull();
    root.remove();
  });
});
