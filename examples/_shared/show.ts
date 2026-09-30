// Mounts an example: the foundation's CSS, the frame of the examples, then the page's component.
import '@sakuzu/kata';
import './example.css';
import type { Component } from 'svelte';
import { mount } from 'svelte';

/**
 * Inside the documentation site, the example follows the site's appearance: light when the site
 * is light, the default dark theme when it is dark. On its own, the example keeps the dark theme.
 */
function followSite(): void {
  let site: HTMLElement | undefined;
  try {
    if (window.parent !== window) site = window.parent.document.documentElement;
  } catch {
    // Embedded by a page of another origin
  }
  if (!site) return;
  const html = site;
  const root = document.documentElement;
  const apply = () => {
    if (html.classList.contains('dark')) root.removeAttribute('data-color-mode');
    else root.setAttribute('data-color-mode', 'light');
  };
  apply();
  new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['class'] });
}

export function show(App: Component): void {
  followSite();
  mount(App, { target: document.body });
}
