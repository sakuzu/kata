<script lang="ts">
  import '../styles/components.css';
  import type { HTMLInputAttributes } from 'svelte/elements';

  // TextInput: a one-line input. The control (a <label>) draws the line, holds the height and the
  // padding at the sides; the bare input inside has no line and no ring. Focus shows once, as the
  // control's line turns blue-ink; an error turns it red-ink; the placeholder is faint. The height is
  // the one the container declares (a button's, or a small button's in a list item or a cell), so
  // the author writes no size. The whole control is a <label>, so a press anywhere on it focuses the
  // input; the name of the field is Field's own <label for>. The width is the caller's.
  //
  //   <Field label="Name" for="n"><TextInput id="n" bind:value={name} /></Field>
  let {
    value = $bindable(''),
    type = 'text',
    placeholder,
    id,
    name,
    autocomplete,
    disabled = false,
    error = false,
    title = false,
    mono = false,
    unit,
    suggestions,
    readonly = false,
    oninput,
    onchange,
    onkeydown,
    onblur,
    ...rest
  }: Omit<
    HTMLInputAttributes,
    | 'class'
    | 'style'
    | 'value'
    | 'type'
    | 'title'
    | 'placeholder'
    | 'name'
    | 'autocomplete'
    | 'disabled'
    | 'readonly'
    | 'oninput'
    | 'onchange'
    | 'onkeydown'
    | 'onblur'
    | 'list'
  > & {
    value?: string;
    type?: 'text' | 'email' | 'password' | 'url';
    placeholder?: string;
    id?: string;
    name?: string;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    disabled?: boolean;
    /** The line turns red-ink */
    error?: boolean;
    /** The input of a name, at the size and weight of h2 */
    title?: boolean;
    /** A code or an identifier: the monospace font with figures of equal width */
    mono?: boolean;
    /** A unit, muted, on the right inside the control */
    unit?: string;
    /** Suggestions: the value may be typed or picked, and need not be one of them */
    suggestions?: string[];
    readonly?: boolean;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onkeydown?: (e: KeyboardEvent) => void;
    onblur?: (e: FocusEvent) => void;
  } = $props();

  // One list of suggestions per control, named by the component
  const listId = $props.id();
  const hasList = $derived((suggestions?.length ?? 0) > 0);

  // type is dynamic, which bind:value does not allow, so the value is copied by hand
  function relay(e: Event & { currentTarget: HTMLInputElement }) {
    value = e.currentTarget.value;
    oninput?.(e);
  }
</script>

<label class="input" class:err={error} class:disabled={disabled} class:title data-role="box" data-h="button">
  <input
    class:mono
    {type}
    {value}
    {placeholder}
    {id}
    {name}
    {autocomplete}
    {disabled}
    {readonly}
    aria-invalid={error || undefined}
    list={hasList ? listId : undefined}
    oninput={relay}
    {onchange}
    {onkeydown}
    {onblur}
    {...rest}
  />
  {#if hasList}
    <datalist id={listId}>
      {#each suggestions ?? [] as s (s)}<option value={s}></option>{/each}
    </datalist>
  {/if}
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
  // The bare input fills the control, and centres its text itself
  .input input {
    @include bare-control;
    flex: 1;
    align-self: stretch;
    &::placeholder {
      color: color(faint);
    }
  }
  // The unit is text in a control, trimmed to its ink
  .unit {
    color: color(muted);
    flex: none;
    @include trim;
  }
  .title {
    @include text(h2);
  }
  .input input.mono {
    font-family: var(--kata-font-mono);
    font-variant-numeric: tabular-nums;
  }
  .err {
    border-color: color(red-ink);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    // The dimmed text already reaches 4.5:1 only; muted is not laid on top
    .unit {
      color: inherit;
    }
  }
</style>
