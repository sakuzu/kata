<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Stats: Stat side by side, gap-lg apart. When they do not fit (a narrow width, a large text
  // size) they wrap, gap-sm between the lines. It holds Stat only. Like a Row, it passes the edge
  // flags to every Stat (data-edge-pass), so that at an edge each one trims the line that touches
  // it.
  //
  //   <Stats><Stat label="Documents" value="128" /><Stat label="Storage" value="1.2 GB" /></Stats>
  let { children }: { children: Snippet } = $props();
</script>

<div class="stats" data-role="stat" data-edge-pass>{@render children()}</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: gap(sm) gap(lg);
    min-width: 0;
  }
</style>
