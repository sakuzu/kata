// The numeric scale of kata, derived from a single root: the golden ratio φ.
//
// Everything else is computed from φ and the small role table below. The only numbers typed in by
// hand, apart from φ itself, are the letter spacings of the type roles, which are optical
// corrections measured per size rather than ratios.
//
// The formulas, in short (docs/scale.md explains them with the resulting values):
//
//   steps     whole = φ, half = √φ, quarter = ⁴√φ (the last two rounded to three decimals)
//   sizes     2xs … 2xl = 1 × φ^n for n = −3 … 3, once in em (follows the element's font size)
//             and once in rem (follows the root)
//   type      font size = 1rem × φ^e, where e is a multiple of 1/4 built from the rounded steps
//             line height = the half step (compact) or the whole step (running text)
//             offset = font size × line height ÷ φ (body text: font size ÷ φ)
//
// This module has no side effects. scripts/scale.mjs writes the CSS (npm run scale).

/** The single root: the golden ratio, to three decimals. */
export const PHI = 1.618;

/** Rounds to three decimals, the precision the steps are written with. */
const thousandths = (/** @type {number} */ x) => Math.round(x * 1000) / 1000;

/**
 * The three steps. The whole step is φ; the half and quarter steps are its square and fourth roots,
 * rounded to three decimals so that every step reads as a written number.
 */
export const STEPS = {
  whole: PHI,
  half: thousandths(PHI ** (1 / 2)),
  quarter: thousandths(PHI ** (1 / 4)),
};

/**
 * φ raised to an exponent that is a multiple of 1/4, built from the rounded steps: whole steps first,
 * then at most one half step and one quarter step. A negative exponent divides.
 * @param {number} exponent
 */
export function stepPower(exponent) {
  let rest = Math.abs(exponent);
  if (Math.round(rest * 4) !== rest * 4) throw new Error(`not a quarter step: ${exponent}`);
  let value = 1;
  while (rest >= 1) {
    value *= STEPS.whole;
    rest -= 1;
  }
  if (rest >= 0.5) {
    value *= STEPS.half;
    rest -= 0.5;
  }
  if (rest >= 0.25) value *= STEPS.quarter;
  return exponent < 0 ? 1 / value : value;
}

/**
 * The seven sizes: 1 multiplied or divided by φ up to three times.
 * @type {[name: string, exponent: number][]}
 */
export const SIZES = [
  ['2xs', -3],
  ['xs', -2],
  ['sm', -1],
  ['md', 0],
  ['lg', 1],
  ['xl', 2],
  ['2xl', 3],
];

/**
 * @typedef {object} Role
 * @property {string} role the name of the role
 * @property {number} size the exponent of φ for the font size, in quarter steps, relative to 1rem
 * @property {'half' | 'whole'} leading the step used as the unitless line height
 * @property {number} tracking the letter spacing in em (negative tightens large text)
 * @property {boolean} offsetLeading whether the offset multiplies by the line height
 */

/**
 * The type roles, from the largest to the smallest. Compact text uses the half step as its line
 * height; running text (body) uses the whole step. The smallest role is spaced out.
 * @type {Role[]}
 */
export const ROLES = [
  { role: 'display2', size: 2, leading: 'half', tracking: -0.022, offsetLeading: true },
  { role: 'title1', size: 1.5, leading: 'half', tracking: -0.022, offsetLeading: true },
  { role: 'title2', size: 1, leading: 'half', tracking: -0.02, offsetLeading: true },
  { role: 'title3', size: 0.5, leading: 'half', tracking: -0.017, offsetLeading: true },
  { role: 'heading', size: 0.25, leading: 'half', tracking: -0.014, offsetLeading: true },
  { role: 'subheading', size: -0.25, leading: 'half', tracking: -0.007, offsetLeading: true },
  { role: 'body', size: 0, leading: 'whole', tracking: -0.011, offsetLeading: false },
  { role: 'capline', size: -0.5, leading: 'half', tracking: 0.0618, offsetLeading: true },
];

/**
 * @typedef {object} ScaleVariable
 * @property {string} name the CSS custom property
 * @property {number} value the number
 * @property {string} unit the unit ('' for a ratio)
 */

/**
 * Computes every variable of the scale.
 * @returns {ScaleVariable[]}
 */
export function computeScale() {
  /** @type {ScaleVariable[]} */
  const out = [];
  const add = (/** @type {string} */ name, /** @type {number} */ value, unit = '') =>
    out.push({ name, value, unit });
  add('--kata-step-whole', STEPS.whole);
  add('--kata-step-half', STEPS.half);
  add('--kata-step-quarter', STEPS.quarter);
  for (const [name, exponent] of SIZES) add(`--kata-size-${name}`, PHI ** exponent, 'em');
  for (const [name, exponent] of SIZES) add(`--kata-size-${name}-rem`, PHI ** exponent, 'rem');
  for (const r of ROLES) {
    const fs = stepPower(r.size);
    const lh = STEPS[r.leading];
    add(`--kata-fs-${r.role}`, fs, 'rem');
    add(`--kata-lh-${r.role}`, lh);
    add(`--kata-ls-${r.role}`, r.tracking, 'em');
    add(`--kata-offset-${r.role}`, (r.offsetLeading ? fs * lh : fs) / STEPS.whole, 'rem');
  }
  return out;
}

/** Formats a number with enough digits that the browser computes the same length as the formula. */
function format(/** @type {number} */ x) {
  return String(Number(x.toPrecision(10)));
}

/** Renders the scale as a CSS file. */
export function renderCss() {
  const lines = computeScale().map((v) => `  ${v.name}: ${format(v.value)}${v.unit};`);
  return [
    '/*',
    ' * The numeric scale of kata, generated from φ = 1.618 by `npm run scale`. Do not edit.',
    ' * The formulas are in src/scale/scale.mjs and docs/scale.md.',
    ' */',
    ':root {',
    ...lines,
    '}',
    '',
  ].join('\n');
}
