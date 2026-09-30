<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Counter: a count on the solid surface, such as the number of unread items. Its height and its
  // least width are the square of an icon; with two digits it grows sideways only (pad-2xs at the
  // sides). The application rounds 100 and more to "99+". The text is a glyph, trimmed to its ink and
  // centred. A ring of two lines in the panel color separates it from an icon it sits on; alone,
  // the ring does not show.
  //
  //   <Counter>3</Counter>   <Counter>99+</Counter>
  let { children }: { children: Snippet } = $props();
</script>

<span data-role="mark" data-h="icon" class="counter"><span class="t">{@render children()}</span></span>

<style lang="scss">
  @use '../styles/kata' as *;

  .counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: h(icon);
    height: h(icon);
    padding-inline: pad(2xs);
    background: color(solid);
    @include text(glyph);
    color: color(on-solid);
    font-variant-numeric: tabular-nums;
    flex: none;
    box-shadow: 0 0 0 calc(#{bw()} * 2) color(panel);
  }
  .t {
    display: block;
    @include trim;
  }
</style>
