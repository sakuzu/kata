<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Kbd: a key or a shortcut. It has two forms. With an outline (monospace caption, a line, pad-xs
  // at the sides, the height of a badge) it sits among words, in a tooltip or a sentence. bare is
  // the monospace text alone, for a column at the right end of a menu or a list of shortcuts. The
  // text is trimmed to its ink in both. One shortcut is one Kbd ("⌘K"), not one per key.
  //
  //   <Kbd>⌘K</Kbd>   <Kbd bare>⌘K</Kbd>
  let {
    bare = false,
    children,
  }: {
    /** Without the outline, for a column of shortcuts */
    bare?: boolean;
    children: Snippet;
  } = $props();
</script>

<kbd data-role="mark" data-h={bare ? undefined : 'badge'} class="kbd" class:bare
  ><span class="key">{@render children()}</span></kbd
>

<style lang="scss">
  @use '../styles/kata' as *;

  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: h(badge);
    padding-inline: pad(xs);
    border: bw() solid color(line-strong);
    font-family: var(--kata-font-mono);
    @include text(caption);
    white-space: nowrap;
    flex: none;
  }
  .key {
    display: block;
    min-width: 0;
    @include trim;
  }
  .bare {
    border: 0;
    padding: 0;
    height: auto;
  }
</style>
