// kata embedded in a page it does not own (docs/layout.md, Embedding kata): no base CSS, and the
// tokens scoped to the root, :root rewritten to the root's selector and the light theme following
// an ancestor as well. The tokens are read from the sources, as the build of the package writes
// them into tokens.css.
import { mount } from 'svelte';
import scale from '../../src/tokens/scale.css?raw';
import tokens from '../../src/tokens/tokens.css?raw';
import '../_shared/example.css';
import App from './App.svelte';

const ROOT = '.embed-root';
const style = document.createElement('style');
style.textContent = `${scale}\n${tokens}`
  .replaceAll(':root', ROOT)
  .replace(
    '[data-color-mode="light"] {',
    `[data-color-mode="light"] ${ROOT}, ${ROOT}[data-color-mode="light"] {`,
  );
document.head.append(style);

const root = document.querySelector<HTMLElement>(ROOT);
if (root) mount(App, { target: root });
