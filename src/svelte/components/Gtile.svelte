<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Gtile: one tile of a grid of cards, for things shown with a picture (documents, folders).
  // The line is the weak one, the surface the panel, hover the raise surface; a selected tile
  // shows a blue line of two inside. The whole tile is pressed, like a list item: it takes
  // onclick or href.
  //
  // The picture reaches the edges (no padding), so it goes in thumb; the title and the details go
  // in children. Only the body has padding (pad-md); its content is a Stack gap 0 (a title and a
  // caption are text that is not trimmed). Actions sit at the top right of the body, above the
  // area that is pressed; below 24rem they move over the top right of the picture.
  //
  //   <Gtile href="/documents/1" label="Riverside plan">
  //     {#snippet thumb()}<Thumbnail size="full" src={url} />{/snippet}
  //     <Text clamp>Riverside plan</Text>
  //     <Text role="caption">3 days ago</Text>
  //   </Gtile>
  let {
    onclick,
    href,
    label,
    sel = false,
    thumb,
    actions,
    children,
  }: {
    onclick?: (e: MouseEvent) => void;
    href?: string;
    /** The accessible name of the tile (its title) */
    label?: string;
    /** Selected: a blue line of two inside */
    sel?: boolean;
    /** The picture, edge to edge */
    thumb?: Snippet;
    /** Actions at the top right (a menu button) */
    actions?: Snippet;
    children: Snippet;
  } = $props();
</script>

<!-- The root is a container. The element that is pressed covers the whole tile, and the actions
     sit above it, so that nothing pressable is inside something pressable -->
<div class="gtile" class:sel data-role="card">
  {#if href}
    <a class="press" {href} {onclick} aria-label={label}></a>
  {:else}
    <button type="button" class="press" {onclick} aria-label={label}></button>
  {/if}
  {#if thumb}<span class="thumbseat">{@render thumb()}</span>{/if}
  <span class="body" data-inset>
    <span class="main"><Stack gap={0}>{@render children()}</Stack></span>
    {#if actions}<span class="actions">{@render actions()}</span>{/if}
  </span>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .gtile {
    position: relative;
    display: flex;
    flex-direction: column;
    border: bw() solid color(line);
    @include surface(panel);
    padding: 0;
    color: inherit;
    text-align: start;
    min-width: 0;
    @include scope-box(button-sm);
  }
  // Covers the tile; only its focus ring and its hover surface show
  .press {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
    @include focus-inside;
    &:hover {
      background: color(raise);
    }
  }
  .sel {
    box-shadow: inset 0 0 0 2px color(blue-ink);
  }
  // The picture reaches the edges and keeps its size when the body is long. Presses go through
  // it to the element below
  .thumbseat {
    display: flex;
    flex-direction: column;
    flex: none;
    min-width: 0;
    position: relative;
    pointer-events: none;
  }
  .body {
    display: flex;
    align-items: flex-start;
    gap: gap(sm);
    @include container;
    min-width: 0;
    position: relative;
    pointer-events: none;
  }
  .main {
    flex: 1 1 auto;
    min-width: 0;
  }
  .actions {
    flex: none;
    display: flex;
    pointer-events: auto;
  }
  // When the body is too narrow (a large text size), the actions move over the picture so that
  // they take no width from the body
  @include tiny {
    .actions {
      position: absolute;
      top: pad(sm);
      right: pad(sm);
    }
  }
</style>
