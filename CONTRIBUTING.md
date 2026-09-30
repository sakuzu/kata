# Contributing

Changes are welcome as pull requests. A change must keep these checks
green; `npm run check` runs them all.

- `npm test`. The scale and the tokens are pinned to their values, so a
  change of a formula shows up as a failing test; the components have
  tests of their behaviour. Change the values only
  with a note in the pull request that says why.
- `npm run scale` leaves no diff. `src/tokens/scale.css` is generated from
  `src/scale/scale.mjs`; edit the generator, not the output.
- `npm run check:terms`. kata serves several kinds of drawing tools, so
  words that belong to one of them (for example the vocabulary of maps)
  do not appear in kata. The list of words and the allowed exceptions are
  in `scripts/check-terms.mjs` and `scripts/check-terms.allow.json`.
- `npm run typecheck`. TypeScript, and svelte-check for the components
  and the examples.
- `npm run lint`. Biome for the code and markdownlint for the documents.
- `npm run check:package`. The package builds (the CSS and the Svelte
  entry) and publint accepts it.
- `npm run audit`. The components' styles are read and their examples are
  measured in a browser; [Checks](docs/checks.md) describes the rules. The
  first run needs a browser: `npx playwright install chromium`.
- `npm run site:build`. The documentation site builds without a dead link.

Documents are written for the people who use kata: what a part is, how to
use it and how it behaves. Design notes, history and the reasons behind a
rule are not part of this repository.

By submitting a change you agree that it is licensed under the Apache
License 2.0 (section 5 of the license).
