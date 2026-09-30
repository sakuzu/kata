// Mounts an example: the foundation's CSS, the frame of the examples, then the page's component.
import '@sakuzu/kata';
import './example.css';
import type { Component } from 'svelte';
import { mount } from 'svelte';

export function show(App: Component): void {
  mount(App, { target: document.body });
}
