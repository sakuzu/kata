// Two projects: the foundation's tests run in Node; the components' tests compile Svelte and run
// in a simulated DOM (jsdom), with the components' styles applied, so that a test can read a
// computed style.
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: { name: 'foundation', include: ['tests/*.test.ts'], environment: 'node' },
      },
      {
        plugins: [svelte(), svelteTesting()],
        test: {
          name: 'svelte',
          include: ['tests/svelte/**/*.test.ts'],
          environment: 'jsdom',
          css: true,
        },
      },
    ],
  },
});
