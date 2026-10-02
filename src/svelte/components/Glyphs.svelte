<script lang="ts">
  import '../styles/components.css';

  // Glyphs: a grid of emoji or symbols to pick one from. The columns (eight by default) fill the
  // width of the container; the selected cell has the raise-2 surface and a blue line inside. The
  // characters are symbols rather than interface text, so they take the size of the h1 role, the
  // smallest at which emoji stay legible. row lays the cells out in one line that scrolls sideways,
  // each cell as wide as a column of the grid, so that a band above a grid lines up with it.
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
    columns = 8,
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
    /** The number of columns of the grid; in a row, a cell is as wide as one of them */
    columns?: number;
  } = $props();

  function isOn(glyph: string, i: number): boolean {
    return selected ? selected(glyph, i) : value !== undefined && glyph === value;
  }
</script>

<div class="glyphs" class:row data-role="grid" style:--kata-glyphs-columns={columns}>
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
    grid-template-columns: repeat(var(--kata-glyphs-columns, 8), minmax(0, 1fr));
    gap: gap(2xs);
    min-width: 0;
  }
  // In a row, a cell is as wide as a column of the grid
  .glyphs.row {
    display: flex;
    overflow-x: auto;
    > .cell {
      $columns: var(--kata-glyphs-columns, 8);
      flex: 0 0 calc((100% - (#{$columns} - 1) * #{gap(2xs)}) / #{$columns});
      min-width: 0;
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
