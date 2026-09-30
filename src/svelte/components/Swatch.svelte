<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Swatch: a sample of a colour, a mark of that colour in the square of an icon. The colour is a
  // value of the content (the colour of a shape, a colour scheme), not a role of the design, so it
  // is the one thing a component takes as a style (--kata-swatch-color). A line is drawn inside, so
  // that a pale colour still shows its edge without growing the mark. In a list item it is centred
  // and does not change the item's height.
  //
  // The shape tells the kind of thing drawn: box (the default) a filled square, dot a point, line a
  // segment, area a small square with a line, ramp a continuous scheme (pass a gradient as the
  // colour), and icon the tool's glyph in that colour, over a halo of line-strong (the same glyph
  // drawn thicker) so that a light colour still stands out. The sizes are fixed in rem.
  //
  // A swatch that is pressed goes inside an icon button.
  //
  //   <Swatch color="#0033ff" />   <Swatch shape="dot" color={c} />   <Swatch shape="icon" icon="polyline" color={c} />
  let {
    color,
    shape = 'box',
    icon,
    fill = false,
  }: {
    /** A CSS colour, or a background for ramp */
    color: string;
    /** The shape of the mark */
    shape?: 'box' | 'dot' | 'line' | 'area' | 'ramp' | 'icon';
    /** The glyph, with shape="icon" */
    icon?: IconSource;
    /** Stretches to the width of its container */
    fill?: boolean;
  } = $props();
</script>

{#if shape === 'icon' && icon}
  <span data-role="mark" class="swatch" data-shape="icon" style:--kata-swatch-color={color} aria-hidden="true">
    <span class="halo"><Icon name={icon} /></span>
    <span class="ink" style:color><Icon name={icon} /></span>
  </span>
{:else}
  <span
    data-role="mark"
    class="swatch"
    data-shape={shape}
    class:fill
    style:--kata-swatch-color={color}
    aria-hidden="true"
  ></span>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .swatch {
    display: inline-block;
    width: h(icon);
    height: h(icon);
    background: var(--kata-swatch-color);
    box-shadow: inset 0 0 0 bw() color(line);
    flex: none;
  }
  // A point is round: the shape of the thing itself
  .swatch[data-shape='dot'] {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
  }
  .swatch[data-shape='line'] {
    width: 0.875rem;
    height: calc(#{bw()} * 2);
    box-shadow: none;
  }
  .swatch[data-shape='area'] {
    width: 0.625rem;
    height: 0.625rem;
    box-shadow: inset 0 0 0 bw() color(line-strong);
  }
  // The coloured glyph over a halo of line-strong; the halo reaches one line further only
  .swatch[data-shape='icon'] {
    position: relative;
    background: none;
    box-shadow: none;
  }
  .halo,
  .ink {
    position: absolute;
    inset: 0;
    display: flex;
  }
  .halo {
    color: color(line-strong);
    :global(svg.kata-icon) {
      stroke-width: 3.5;
    }
  }
  .swatch[data-shape='ramp'] {
    width: 3rem;
    height: 0.5rem;
    box-shadow: none;
  }
  .swatch.fill {
    width: 100%;
  }
</style>
