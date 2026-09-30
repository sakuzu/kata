<script lang="ts">
  import '../styles/components.css';
  import Icon from './Icon.svelte';

  // SearchInput: the input of a search. It is the same control as TextInput with a magnifying glass
  // at its start; focus shows once, on the control's line. The height is the one the container
  // declares. label names the input (inside a Field the field names it). Keys such as clearing
  // with Escape are the caller's, through onkeydown.
  //
  //   <SearchInput bind:value={query} placeholder="Find a document" label="Search documents" />
  let {
    value = $bindable(''),
    placeholder = '',
    label,
    id,
    disabled = false,
    onkeydown,
    oninput,
  }: {
    value?: string;
    placeholder?: string;
    /** The accessible name */
    label?: string;
    id?: string;
    disabled?: boolean;
    onkeydown?: (e: KeyboardEvent) => void;
    /** Every key stroke */
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
  } = $props();
</script>

<label class="input" class:disabled={disabled} data-role="box" data-h="button">
  <Icon name="search" />
  <input
    type="search"
    bind:value
    {placeholder}
    {id}
    {disabled}
    aria-label={label}
    {onkeydown}
    {oninput}
  />
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
  .input :global(svg) {
    color: color(muted);
  }
  .input input {
    @include bare-control;
    flex: 1;
    align-self: stretch;
    &::placeholder {
      color: color(faint);
    }
    // The browser's clear button is hidden; clearing is the caller's
    &::-webkit-search-cancel-button {
      appearance: none;
    }
  }
  .disabled {
    opacity: dim();
    cursor: default;
  }
</style>
