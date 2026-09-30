<script lang="ts">
  import '../styles/components.css';

  // ColorGrid: a grid of preset colours. The colours stand in columns (9 by default) gap-2xs
  // apart, and each colour is itself the cell that is pressed; nothing is placed inside a cell. The
  // chosen cell shows one ring inside, two lines wide, with no surface or shadow added. A colour
  // cannot be described by its look, so each cell is named by the colour's name, and the group by
  // label.
  //
  //   <ColorGrid colors={swatches} value={hex} label="Color" onselect={pick} />
  let {
    colors,
    value,
    onselect,
    label,
    columns = 9,
  }: {
    colors: { hex: string; name: string }[];
    /** The chosen colour (compared without regard to case) */
    value?: string;
    onselect: (hex: string) => void;
    /** The name of the group */
    label: string;
    /** The number of columns (9 by default) */
    columns?: number;
  } = $props();

  function on(hex: string): boolean {
    return value !== undefined && hex.toLowerCase() === value.toLowerCase();
  }
</script>

<div class="grid" data-role="grid" role="radiogroup" aria-label={label} style:--kata-color-grid-columns={columns}>
  {#each colors as c (c.hex)}
    <button
      type="button"
      class="cell"
      class:on={on(c.hex)}
      role="radio"
      aria-checked={on(c.hex)}
      aria-label={c.name}
      style:--kata-color-grid-color={c.hex}
      onclick={() => onselect(c.hex)}
    ></button>
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--kata-color-grid-columns), minmax(0, 1fr));
    gap: gap(2xs);
    min-width: 0;
  }
  // The size of a cell comes from the columns and the width of the container
  .cell {
    aspect-ratio: 1;
    width: 100%;
    border: 0;
    padding: 0;
    background: var(--kata-color-grid-color);
    box-shadow: inset 0 0 0 bw() color(line);
    cursor: pointer;
  }
  // The ring: two lines of the focus colour inside, and one of the panel within them, which
  // separates the ring from the colour
  .cell.on {
    box-shadow:
      inset 0 0 0 calc(#{bw()} * 2) color(focus),
      inset 0 0 0 calc(#{bw()} * 3) color(panel);
  }
</style>
