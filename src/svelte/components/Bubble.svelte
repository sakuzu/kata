<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Bubble: the surface of a Popover, without a trigger: the panel color, a strong line, the width
  // of a popover (never wider than the window), pad-md inside and the content in a Stack (gap-sm
  // by default). A surface opened from a trigger is a Popover, which wears this one. A Bubble is
  // used directly where the application places it, such as a card pinned to a point of the stage.
  //
  // With foot, only the content scrolls and the foot stays in view, below a line; the place decides
  // the greatest height. flush drops the padding, for content that holds its own and stacks with
  // no gap.
  //
  //   <Bubble gap="sm">…</Bubble>
  //   <Bubble>…the conversation…{#snippet foot()}…the reply…{/snippet}</Bubble>
  let {
    gap = 'sm',
    flush = false,
    foot,
    children,
  }: {
    /** The distance between the children */
    gap?: 0 | 'sm' | 'md' | 'lg';
    /** No padding and no gap: the content holds its own */
    flush?: boolean;
    /** A part below the content that does not scroll */
    foot?: Snippet;
    children: Snippet;
  } = $props();
</script>

<div class="pop" class:tall={!!foot} data-role="popover" data-outline>
  <div class="body" class:flush data-inset={flush ? undefined : true}>
    <Stack gap={flush ? 0 : gap}>{@render children()}</Stack>
  </div>
  {#if foot}<div class="foot" data-inset>{@render foot()}</div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .pop {
    width: var(--kata-width-popover);
    max-width: calc(100vw - #{gap(md)} * 2);
    @include surface(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    min-width: 0;
    display: flex;
    flex-direction: column;
    @include scope-box(button);
  }
  // The content holds the padding, so text never touches the edge while it scrolls
  .body:not(.flush) {
    @include container;
    min-width: 0;
  }
  .body.flush {
    @include bundle;
    min-width: 0;
  }
  .tall {
    max-height: 100%;
    min-height: 0;
  }
  .tall .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
  }
  .foot {
    @include container;
    border-top: bw() solid color(line);
    flex: none;
  }
</style>
