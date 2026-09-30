# kata

kata is the design system of sakuzu, an organization that publishes
open-source tools for drawing: a map editor, a whiteboard, a globe, and the
examples and standard UI of a drawing library. It gives these tools one
look and one set of rules, and it is written for anyone who builds a
drawing application on the web and wants the same foundation.

kata has three layers.

1. A foundation that needs no framework: a numeric scale derived from the
   golden ratio φ as its single root, tokens (CSS custom properties for
   spacing, type and color), base CSS, and the rules that tie them
   together. One stylesheet brings it into any web page.
2. Components such as Button, Input, Panel and Tree, bound first for Svelte
   (`@sakuzu/kata/svelte`). Not published yet.
3. Parts for drawing applications: the shell, the layer tree, the
   inspector, settings and the toolbar. They know nothing about what is
   drawn; the application passes the content in. Not published yet.

Three rules hold in every layer.

- No geography vocabulary. Coordinates, distances, map data formats and
  the names of rendering libraries belong to the application, so the same
  parts serve a whiteboard as well as a map.
- Every string comes from outside, through props or a messages API. The
  defaults are English; kata has no translation machinery of its own.
- The vocabulary is four layers (scale, token, component, pattern), English
  component names and three scales (spacing, type and color). No value
  gets a name of its own.

## Install

```sh
npm install @sakuzu/kata
```

The package has three entries, all plain CSS.

| Entry | Contents |
| --- | --- |
| `@sakuzu/kata` | The scale, the tokens and the base CSS |
| `@sakuzu/kata/tokens.css` | The scale and the tokens, no global rules |
| `@sakuzu/kata/base.css` | The base CSS alone (it needs the tokens) |

Import the whole foundation once and write with the tokens.

```css
@import "@sakuzu/kata";
.note {
  padding: var(--kata-pad-md);
  background: var(--kata-color-panel);
}
```

Without a bundler, link `node_modules/@sakuzu/kata/dist/kata.css` from the
page. The theme is dark; `data-color-mode="light"` on any element turns
the elements inside it light.

## The scale

Every length in kata comes from one number, φ = 1.618. The whole step is φ,
the half step its square root and the quarter step its fourth root. Seven
sizes run from 1 ÷ φ³ to 1 × φ³, once in em (for padding, which follows the
component's text) and once in rem (for gaps, which follow the root). Eight
type roles take their size from powers of φ in quarter steps and their line
height from the half or the whole step. The generator is
`src/scale/scale.mjs`, and `npm run scale` writes its output to
`src/tokens/scale.css`. [The scale](docs/scale.md) explains the formulas
and lists the values.

## Documentation

The chapters are in [docs](docs/README.md): the principles, the scale and
the tokens, with more to come as the components arrive. `npm run site:dev`
serves them as a site.

## Development

```sh
npm install
npm test               # the scale and the tokens against their pinned values
npm run lint           # Biome and markdownlint
npm run check:terms    # the vocabulary rule
npm run site:build     # the documentation site and the examples
```

## License

Apache-2.0. Copyright 2026 Kasika, Inc. See [LICENSE](LICENSE) and
[NOTICE](NOTICE).

The numeric scale follows ideas from LiftKit (Chainlift); no code or text
from it is included.
