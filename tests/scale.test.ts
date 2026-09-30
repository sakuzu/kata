import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { computeScale, PHI, renderCss, STEPS, stepPower } from '../src/scale/scale.mjs';
import fixture from './fixtures/scale.json' with { type: 'json' };

// The fixture pins every variable of the scale to four significant digits. A consumer relies on
// these numbers for every length it draws, so a change to one of them is a breaking change.
const expected = fixture as Record<string, number>;

const OUTPUT = new URL('../src/tokens/scale.css', import.meta.url);

/** Reads `--name: value` pairs from the generated CSS as plain numbers (units dropped). */
function readCss(css: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of css.matchAll(/(--kata-[a-z0-9-]+):\s*(-?[0-9.]+)(?:em|rem)?;/g)) {
    out[m[1]] = Number(m[2]);
  }
  return out;
}

const sig4 = (x: number) => Number(x.toPrecision(4));

describe('scale', () => {
  const css = readFileSync(OUTPUT, 'utf8');
  const generated = readCss(css);

  it('the committed scale.css is what the generator writes', () => {
    expect(css).toBe(renderCss());
  });

  it('defines exactly the pinned variables', () => {
    expect(Object.keys(generated).sort()).toEqual(Object.keys(expected).sort());
    expect(computeScale()).toHaveLength(Object.keys(expected).length);
  });

  it.each(Object.entries(expected))('%s = %s', (name, value) => {
    expect(sig4(generated[name])).toBe(value);
  });

  it('builds quarter-step powers from the rounded steps', () => {
    expect(stepPower(0)).toBe(1);
    expect(stepPower(1)).toBe(PHI);
    expect(stepPower(1.5)).toBeCloseTo(STEPS.whole * STEPS.half, 12);
    expect(stepPower(-0.25)).toBeCloseTo(1 / STEPS.quarter, 12);
    expect(() => stepPower(0.1)).toThrow();
  });
});
