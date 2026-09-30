<script lang="ts">
  import '../styles/components.css';

  // Glyphs: a grid of emoji or symbols to pick one from. Eight columns fill the width of the
  // container; the selected cell has the raise-2 surface and a blue line inside. The characters are
  // symbols rather than interface text, so they take the size of the h1 role, the smallest at which
  // emoji stay legible. row lays the cells out in one line that scrolls sideways.
  //
  // The font of the characters comes from --kata-glyph-font, set by the container (an emoji font,
  // for example); without it they inherit.
  //
  //   <Glyphs items={['★', '●', '▲']} value={picked} onselect={(g) => (picked = g)} />
  let {
    items,
    value,
    onselect,
    label,
    selected,
    row = false,
  }: {
    /** The characters, one per cell */
    items: string[];
    /** The selected character */
    value?: string;
    onselect: (glyph: string, i: number) => void;
    /** The accessible name of a cell; without it the character is its name */
    label?: (glyph: string, i: number) => string;
    /** Whether a cell is selected (default: glyph === value) */
    selected?: (glyph: string, i: number) => boolean;
    /** One line instead of a grid */
    row?: boolean;
  } = $props();

  function isOn(glyph: string, i: number): boolean {
    return selected ? selected(glyph, i) : value !== undefined && glyph === value;
  }
</script>

<div class="glyphs" class:row data-role="grid">
  <!-- Keyed by position: the same character can appear twice -->
  {#each items as glyph, i (i)}
    <button
      type="button"
      class="cell"
      data-role="glyph"
      class:on={isOn(glyph, i)}
      aria-pressed={isOn(glyph, i)}
      aria-label={label?.(glyph, i)}
      onclick={() => onselect(glyph, i)}
    >
      {glyph}
    </button>
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .glyphs {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: gap(2xs);
    min-width: 0;
  }
  .glyphs.row {
    display: flex;
    overflow-x: auto;
    > .cell {
      flex: none;
      min-width: h(button);
    }
  }
  .cell {
    font-family: var(--kata-glyph-font, inherit);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: h(button);
    border: 0;
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: fs(h1);
    line-height: lh(h1);
    cursor: pointer;
    text-box: none;
    @include focus-inside;
    &:hover {
      background: color(raise);
    }
  }
  .on {
    background: color(raise-2);
    box-shadow: inset 0 0 0 bw() color(blue-ink);
  }
</style>
