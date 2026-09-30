<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Block: a wrapper with padding (md on all sides). Inside a container without padding (a panel,
  // a menu), it holds what does not reach the edges: text, fields, name and value pairs. Lists,
  // trees, tables and section headers reach the edges and do not go in a Block. Its content is a
  // Stack.
  //
  //   <Block><Stack gap="sm">…</Stack></Block>
  let { children }: { children: Snippet } = $props();
</script>

<div class="block" data-inset data-role="block">{@render children()}</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .block {
    @include container;
    min-width: 0;
    flex: none;
  }
</style>
