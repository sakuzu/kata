<script lang="ts" generics="T extends string">
  import '../styles/components.css';
  import Icon from './Icon.svelte';

  // NativeSelect: a select that looks like a trigger and opens the browser's own list. Use it on
  // phones and for long lists (languages, time zones); a Select, with its own list, is for five
  // options or more that carry a description. The control (a <label>) draws the line, holds the
  // height, the padding at the sides and the chevron on the right; the bare select inside is
  // transparent. The height is the one the container declares.
  //
  //   <Field label="Language" for="lang"><NativeSelect id="lang" {options} bind:value /></Field>
  let {
    options = [],
    groups,
    value = $bindable(),
    placeholder,
    id,
    ariaLabel,
    disabled = false,
    error = false,
    onchange,
  }: {
    /** An option that is disabled shows that it cannot be chosen now, without hiding it */
    options?: { value: T; label: string; disabled?: boolean }[];
    /** Options under headings, shown before options */
    groups?: { label: string; options: { value: T; label: string }[] }[];
    value?: T;
    /** The first line while nothing is chosen, shown faint; it goes once a value is chosen */
    placeholder?: string;
    id?: string;
    /** The accessible name where no <label for> names it */
    ariaLabel?: string;
    disabled?: boolean;
    error?: boolean;
    onchange?: (value: T) => void;
  } = $props();
</script>

<label class="trigger" class:err={error} class:disabled={disabled} data-role="box" data-h="button">
  <select
    {id}
    {disabled}
    required={placeholder !== undefined}
    aria-label={ariaLabel}
    aria-invalid={error || undefined}
    bind:value
    onchange={(e) => onchange?.(e.currentTarget.value as T)}
  >
    {#if placeholder !== undefined}
      <option value="" disabled data-kata-placeholder>{placeholder}</option>
    {/if}
    {#each groups ?? [] as group (group.label)}
      <optgroup label={group.label}>
        {#each group.options as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </optgroup>
    {/each}
    {#each options as opt (opt.value)}
      <option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
    {/each}
  </select>
  <Icon name="chevron-down" />
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  .trigger {
    @include box;
    width: 100%;
    min-width: 0;
    justify-content: space-between;
    cursor: pointer;
    &:focus-within {
      border-color: color(blue-ink);
    }
  }
  .trigger select {
    @include bare-control;
    flex: 1;
    align-self: stretch;
    cursor: pointer;
    // Nothing chosen (the placeholder) is faint
    &:invalid {
      color: color(faint);
    }
  }
  // The list is the browser's; its ground follows the panel
  .trigger select option {
    background: color(panel);
    color: color(text);
  }
  .trigger :global(svg) {
    flex: none;
  }
  .err {
    border-color: color(red-ink);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    select {
      cursor: default;
    }
  }
</style>
