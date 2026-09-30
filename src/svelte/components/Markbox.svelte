<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Markbox: the place of an icon. A square of an icon's size that centres what it holds (an
  // icon, an emoji, a color mark, a Swatch), so that the first column of a list stays in place
  // when the marks differ in size. It has no surface and no line, and it does not change the
  // height of a list item.
  //
  //   <Markbox><Icon name="image" /></Markbox>   <Markbox glyph>🏔️</Markbox>
  let {
    glyph = false,
    children,
  }: {
    /** The content is an emoji; its font is --kata-glyph-font, set by the container */
    glyph?: boolean;
    children: Snippet;
  } = $props();
</script>

<span class="markbox" class:glyph data-role="markbox" data-h="icon">{@render children()}</span>

<style lang="scss">
  @use '../styles/kata' as *;

  .markbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(icon);
    height: h(icon);
    flex: none;
  }
  // An emoji is not trimmed: its top would be cut
  .glyph {
    font-family: var(--kata-glyph-font, inherit);
  }
</style>
