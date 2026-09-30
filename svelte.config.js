// The Svelte configuration, read by the Vite plugin (the examples and the tests), svelte-check
// and svelte-package. Components write their styles in Sass, which the preprocessor compiles, so
// the published components carry plain CSS.
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
  preprocess: vitePreprocess(),
  compilerOptions: { runes: true },
};
