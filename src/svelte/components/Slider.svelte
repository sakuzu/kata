<script lang="ts">
  import '../styles/components.css';

  // Slider: the input of a value on a range. It is a control of the height of a small button, and
  // the whole control can be dragged. The track is two lines thick (solid on the side that has
  // been passed), the thumb is the square of an icon, and the value sits on the right in a slot of
  // fixed width, aligned to its end, so that the width does not change with the digits. It is a
  // native range input: dragging, the arrow keys and screen readers work as the browser does.
  //
  //   <Slider value={opacity} display="70%" ariaLabel="Opacity" onchange={apply} />
  let {
    value,
    min = 0,
    max = 100,
    step = 1,
    display,
    id,
    disabled = false,
    ariaLabel,
    oninput,
    onchange,
  }: {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    /** The value as shown on the right, with its unit (the number itself by default) */
    display?: string;
    id?: string;
    disabled?: boolean;
    ariaLabel?: string;
    /** Every change while dragging */
    oninput?: (value: number) => void;
    /** The value when it is let go or changed with a key */
    onchange?: (value: number) => void;
  } = $props();

  const pct = $derived(max > min ? ((value - min) / (max - min)) * 100 : 0);
</script>

<div class="slider" class:disabled={disabled} data-role="switch" data-h="button-sm">
  <input
    type="range"
    {min}
    {max}
    {step}
    {value}
    {id}
    {disabled}
    aria-label={ariaLabel}
    style:--kata-slider-fill={`${pct}%`}
    oninput={(e) => oninput?.(Number(e.currentTarget.value))}
    onchange={(e) => onchange?.(Number(e.currentTarget.value))}
  />
  <span class="val">{display ?? String(value)}</span>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .slider {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(button-sm);
    min-width: 0;
  }
  // The input fills the control, which is the area that is dragged
  input {
    appearance: none;
    flex: 1;
    min-width: 0;
    height: h(button-sm);
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }
  // The track is as high as the thumb, and draws its line of two widths across its middle, so that
  // the thumb sits on it without an offset. The colors of the passed part, the rest and the thumb
  // are properties, so that disabled changes them
  .slider {
    --kata-slider-passed: #{color(solid)};
    --kata-slider-rest: #{color(line-strong)};
    --kata-slider-thumb: #{color(text)};
  }
  @mixin track {
    height: h(icon);
    background: linear-gradient(
        to right,
        var(--kata-slider-passed) 0 var(--kata-slider-fill),
        var(--kata-slider-rest) var(--kata-slider-fill) 100%
      )
      center / 100% calc(#{bw()} * 2) no-repeat;
  }
  @mixin thumb {
    appearance: none;
    width: h(icon);
    height: h(icon);
    border: 0;
    border-radius: 0;
    background: var(--kata-slider-thumb);
  }
  input::-webkit-slider-runnable-track {
    @include track;
  }
  input::-moz-range-track {
    @include track;
  }
  input::-webkit-slider-thumb {
    @include thumb;
  }
  input::-moz-range-thumb {
    @include thumb;
  }
  input:disabled {
    cursor: default;
  }
  // Text in a control, trimmed to its ink
  .val {
    flex: none;
    width: 3.5rem;
    text-align: end;
    @include text(body);
    font-variant-numeric: tabular-nums;
    @include trim;
  }
  // Disabled is the same shape without hue. The passed part is the filled shape, not dimmed: the
  // disabled surface, and the thumb its text on that surface (the knob of a switch that is on).
  // The line of the rest and the value are dimmed
  .disabled {
    --kata-slider-passed: #{color(solid-disabled)};
    --kata-slider-rest: color-mix(in srgb, #{color(line-strong)} calc(#{dim()} * 100%), transparent);
    --kata-slider-thumb: linear-gradient(#{color(solid-disabled-text)} 0 0) #{color(solid-disabled)};
    .val {
      opacity: dim();
    }
  }
</style>
