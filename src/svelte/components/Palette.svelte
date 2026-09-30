<script lang="ts">
  import '../styles/components.css';

  // Palette: a sample of a colour scheme, one rectangle of colours side by side without a gap;
  // pressing it chooses the scheme. It is as high as a small button, each colour is gap-md wide and
  // the line is line-strong; the chosen palette's line is blue, with no surface or shadow added.
  // label is the accessible name (the name of the scheme). The colours are values of the content,
  // like a Swatch's. The caller arranges the palettes and gives the group role="radiogroup" (a Row
  // with wrap).
  //
  //   <Palette colors={['#eee', '#999', '#333']} label="Greys" sel={current === 'greys'} onclick={pick} />
  let {
    colors,
    label,
    sel = false,
    disabled = false,
    onclick,
  }: {
    colors: string[];
    /** The name of the scheme (the accessible name) */
    label: string;
    /** Chosen */
    sel?: boolean;
    disabled?: boolean;
    onclick?: () => void;
  } = $props();
</script>

<button
  class="pal"
  class:sel
  type="button"
  role="radio"
  aria-checked={sel}
  aria-label={label}
  {disabled}
  {onclick}
  data-role="box"
  data-h="button-sm"
>
  {#each colors as c, i (i)}
    <span class="c" style:--kata-palette-color={c}></span>
  {/each}
</button>

<style lang="scss">
  @use '../styles/kata' as *;

  .pal {
    display: inline-flex;
    height: h(button-sm);
    padding: 0;
    border: bw() solid color(line-strong);
    background: none;
    cursor: pointer;
    flex: none;
  }
  .pal.sel {
    border-color: color(blue-ink);
  }
  .pal:disabled {
    cursor: default;
    opacity: dim();
  }
  .c {
    width: gap(md);
    height: 100%;
    background: var(--kata-palette-color);
  }
</style>
