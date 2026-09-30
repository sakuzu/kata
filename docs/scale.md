# Scale

Every length in kata is derived from one number, the golden ratio φ,
written to three decimals: φ = 1.618. The scale turns it into three steps,
seven sizes and eight type roles. The tokens are built from these values
and from nothing else.

The generator is `src/scale/scale.mjs`. `npm run scale` writes its output,
`src/tokens/scale.css`, which is not edited by hand. A test pins every
value to four significant digits, so a change to the scale is always a
deliberate, breaking change.

[The scale, live](../examples/scale/)

## Steps

A step is a ratio between two neighbouring values. There are three.

| Step | Formula | Value | Variable |
| --- | --- | --- | --- |
| whole | φ | 1.618 | `--kata-step-whole` |
| half | √φ | 1.272 | `--kata-step-half` |
| quarter | ⁴√φ | 1.128 | `--kata-step-quarter` |

The half and quarter steps are rounded to three decimals, so that each
step reads as a written number. Any power of φ in quarter steps is then a
product of these three numbers: whole steps first, then at most one half
step and one quarter step, and a negative exponent divides. φ^1.5 is
1.618 × 1.272 = 2.058096, and φ^−0.25 is 1 ÷ 1.128. Because of the
rounding, two half steps make 1.617984 rather than 1.618; the scale keeps
the rounded product and does not correct it.

## Sizes

Seven sizes run from 1 ÷ φ³ to 1 × φ³.

| Size | Formula | Value |
| --- | --- | --- |
| 2xs | 1 ÷ φ³ | 0.2361 |
| xs | 1 ÷ φ² | 0.3820 |
| sm | 1 ÷ φ | 0.6180 |
| md | 1 | 1 |
| lg | 1 × φ | 1.618 |
| xl | 1 × φ² | 2.618 |
| 2xl | 1 × φ³ | 4.236 |

Each size exists twice. `--kata-size-<size>` is in em, so it follows the
font size of the element that uses it; the padding of a component grows
with its text. `--kata-size-<size>-rem` is in rem, so it follows only the
root font size; the gaps of a layout, which has no text of its own, stay
the same however deeply it is nested.

## Type roles

A type role fixes four values: the font size, the line height, the letter
spacing and the offset.

- The font size is 1rem × φ^e, where the exponent e is a multiple of one
  quarter, built from the rounded steps as above.
- The line height is a step, used as a ratio. Compact text (titles,
  headings, captions) uses the half step, 1.272. Running text uses the
  whole step, 1.618.
- The letter spacing is in em. It is the one value that is not a formula:
  it is an optical correction measured for each size, negative for large
  text, which looks loose, and positive for the smallest, which looks
  cramped.
- The offset is the font size × the line height ÷ φ. It is a distance that
  belongs to the text, used to place text against a baseline and to set
  the space between a heading and the text it introduces. For body text,
  whose line height is φ itself, the offset is the font size ÷ φ.

| Role | e | Font size | Line height | Letter spacing | Offset |
| --- | --- | --- | --- | --- | --- |
| display2 | 2 | 2.618rem | half | −0.022em | 2.058rem |
| title1 | 1.5 | 2.058rem | half | −0.022em | 1.618rem |
| title2 | 1 | 1.618rem | half | −0.02em | 1.272rem |
| title3 | 0.5 | 1.272rem | half | −0.017em | 1.000rem |
| heading | 0.25 | 1.128rem | half | −0.014em | 0.8868rem |
| subheading | −0.25 | 0.8865rem | half | −0.007em | 0.6969rem |
| body | 0 | 1rem | whole | −0.011em | 0.6180rem |
| capline | −0.5 | 0.7862rem | half | 0.0618em | 0.6180rem |

The variables are `--kata-fs-<role>`, `--kata-lh-<role>`,
`--kata-ls-<role>` and `--kata-offset-<role>`. Components do not use them
directly: the [tokens](tokens.md) give each role of an interface (a title,
body text, a caption, a label) one of these steps.

## Changing the root

Nothing in the scale is typed in except φ and the letter spacings. Setting
another root in the generator and running `npm run scale` produces a
consistent scale, and every token follows. The pinned values in the tests
fail on purpose when that happens.
