<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Markbox: the place of an icon. A square of an icon's size that centres what it holds (an
  // icon, an emoji, a color mark, a Swatch), so that the first column of a list stays in place
  // when the marks differ in size. It has no surface and no line, and it does not change the
  // height of a list item. It is a seat: its baseline is that of a trimmed line centred in it, so
  // in a Row with align="first" the mark is centred on the ink of the first line of the text
  // beside it.
  //
  //   <Markbox><Icon name="image" /></Markbox>   <Markbox glyph>🏔️</Markbox>
  //   <Row gap="2xs" align="first"><Markbox><Icon name="check" /></Markbox><Text>…</Text></Row>
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
    @include seat(h(icon));
    justify-content: center;
    width: h(icon);
  }
  // An emoji is not trimmed: its top would be cut
  .glyph {
    font-family: var(--kata-glyph-font, inherit);
  }
</style>
