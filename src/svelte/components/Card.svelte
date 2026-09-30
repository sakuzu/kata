<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Card: a container with padding and a line: pad-md on every side, whatever it holds. Its
  // content is a Stack (default gap sm). danger turns the line red, for a group of actions that
  // remove something. The controls inside have a button's height.
  //
  //   <Card><Text role="h2">Title</Text><Text role="caption">A description</Text></Card>
  let {
    gap = 'sm',
    danger = false,
    children,
  }: {
    /** The distance between the children */
    gap?: 0 | 'sm' | 'md' | 'lg';
    /** A red line */
    danger?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="card" data-inset class:danger data-role="card">
  <Stack {gap}>{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .card {
    border: bw() solid color(line);
    @include container;
    background: color(panel);
    min-width: 0;
    flex: none;
    @include scope-box(button);
  }
  .danger {
    border-color: color(red-ink);
  }
</style>
