<script lang="ts">
  import '../styles/components.css';

  // NumberInput: the input of a number. It is the same control as TextInput, with the value
  // aligned to the end and the unit, muted, on the right inside the control. The height is the one
  // the container declares. Only short values such as numbers and dates take a fixed width, and
  // only one of three: 6, 8 or 12rem.
  //
  //   <Field label="Line width" for="w"><NumberInput id="w" bind:value unit="px" width="6rem" /></Field>
  let {
    value = $bindable(null),
    unit,
    min,
    max,
    step,
    placeholder,
    id,
    ariaLabel,
    disabled = false,
    readonly = false,
    error = false,
    width,
    oninput,
    onchange,
  }: {
    /** The number, or null when the input is empty */
    value?: number | null;
    /** A unit (px, %, °) */
    unit?: string;
    min?: number;
    max?: number;
    /** The step; 'any' for an input that takes decimals */
    step?: number | 'any';
    /** A word shown when empty, where empty has a meaning (for example Auto) */
    placeholder?: string;
    id?: string;
    /** The accessible name where no <label for> names it */
    ariaLabel?: string;
    disabled?: boolean;
    /** Can be focused and selected, not changed */
    readonly?: boolean;
    error?: boolean;
    /** The width of the control; without it, it fills its container */
    width?: '6rem' | '8rem' | '12rem';
    /** Every key stroke (the raw value is e.currentTarget.value) */
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    /** The value is committed */
    onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
  } = $props();
</script>

<label class="input" class:err={error} class:disabled={disabled} data-role="box" data-h="button" style:width>
  <input
    type="number"
    bind:value
    {min}
    {max}
    {step}
    {placeholder}
    {id}
    {disabled}
    {readonly}
    aria-label={ariaLabel}
    aria-invalid={error || undefined}
    {oninput}
    {onchange}
  />
  {#if unit}<span class="unit">{unit}</span>{/if}
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  .input {
    @include box;
    width: 100%;
    min-width: 0;
    justify-content: flex-start;
    cursor: text;
    &:focus-within {
      border-color: color(blue-ink);
    }
  }
  .input input {
    @include bare-control;
    flex: 1;
    align-self: stretch;
    text-align: end;
    font-variant-numeric: tabular-nums;
    &::placeholder {
      color: color(faint);
    }
  }
  .unit {
    color: color(muted);
    flex: none;
    @include trim;
  }
  .err {
    border-color: color(red-ink);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    .unit {
      color: inherit;
    }
  }
</style>
