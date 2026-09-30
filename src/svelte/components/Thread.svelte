<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Thread: the replies under a message. A line along the left, and the replies indented pad-md
  // from it, stacked gap-sm apart by default (the same distance as from the message above, which
  // the Stack around them holds). The Comments inside have no padding at the sides. The thread has
  // no margin of its own, so its line stands at the edge of its column; at the sides it follows the
  // list items (pad-md in a container without padding).
  //
  //   <Thread>{#each replies as r (r.id)}<Comment name={r.name} time={r.time}>…</Comment>{/each}</Thread>
  let {
    gap = 'sm',
    children,
  }: {
    /** The distance between the replies */
    gap?: 0 | 'sm' | 'md' | 'lg';
    /** The replies, Comments */
    children: Snippet;
  } = $props();
</script>

<div class="thread" data-role="thread">
  <div class="in"><Stack {gap}>{@render children()}</Stack></div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .thread {
    padding-inline: var(--kata-inset, #{pad(md)});
    min-width: 0;
  }
  .in {
    border-left: bw() solid color(line);
    padding-left: pad(md);
    min-width: 0;
    --kata-inset: 0px;
  }
</style>
