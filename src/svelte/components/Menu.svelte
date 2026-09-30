<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Menu: the surface of a menu: the panel colour, a strong line and a least width of 12rem, never
  // wider than the window. It has no padding, so the hover surface of each MenuItem reaches the
  // edges and the dividers. Dropdown with menu wears this surface itself; Menu is for a menu placed
  // by the caller, such as a submenu that opens to the right. The roles and the keys belong to the
  // content.
  //
  // An item is as high as its content plus pad-md above and below. rows raises the least height of
  // every item, for a menu whose items hold different content and should line up.
  //
  //   <Menu><div role="menu">…MenuItem…</div></Menu>
  let {
    rows,
    children,
  }: {
    /** The least height of the items: mark, box, thumb or two lines */
    rows?: 'mark' | 'box' | 'thumb' | 'two';
    children: Snippet;
  } = $props();
</script>

<div class="menu" data-role="menu" data-rows={rows}>{@render children()}</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .menu {
    background: color(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    min-width: min(12rem, calc(100vw - #{gap(md)} * 2));
    max-width: calc(100vw - #{gap(md)} * 2);
    display: flex;
    flex-direction: column;
    &[data-rows='mark'] {
      --kata-row-h: #{h(list-item-mark)};
    }
    &[data-rows='box'] {
      --kata-row-h: #{h(list-item-lg)};
    }
    &[data-rows='thumb'] {
      --kata-row-h: #{h(thumbnail-row)};
    }
    &[data-rows='two'] {
      --kata-row-h: #{h(list-item-two)};
    }
  }
</style>
