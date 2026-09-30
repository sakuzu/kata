<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Veil: a surface that covers its parent with the ground colour and centres its content (a
  // loading state). It lies over a drawing that must not show yet. It has a surface and a layer
  // only, no text and no spacing of its own. The parent must be a positioned element.
  //
  //   <Veil busy><Text role="caption">Loading</Text></Veil>
  let {
    busy = false,
    children,
  }: {
    /** Tells assistive technology that the content is loading (aria-busy) */
    busy?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="veil" data-role="veil" aria-busy={busy || undefined}>
  {@render children()}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // On the layer of modals, above the panels of the frame
  .veil {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: z(modal);
    background: color(ground);
  }
</style>
