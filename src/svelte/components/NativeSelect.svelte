<script lang="ts" generics="T extends string">
  import '../styles/components.css';
  import Icon from './Icon.svelte';

  // NativeSelect: a select that looks like a trigger and opens the browser's own list. Use it on
  // phones and for long lists (languages, time zones); a Select, with its own list, is for five
  // options or more that carry a description. The control (a <label>) draws the line, holds the
  // height, the padding at the sides and the chevron on the right. The chosen option's label is
  // drawn in a span, one line with an ellipsis, and the select lies over the whole control,
  // transparent, so that it still takes the press, the focus and the keys and names the control;
  // every browser then shows the ellipsis (WebKit draws none in a select). The height is the one
  // the container declares.
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

  // What the control shows: the chosen option's label, the placeholder while nothing is chosen, or
  // else the first option that can be chosen, which the browser shows when no option matches
  const all = $derived<{ value: T; label: string; disabled?: boolean }[]>([
    ...(groups ?? []).flatMap((g) => g.options),
    ...options,
  ]);
  const chosen = $derived(all.find((o) => o.value === value));
  const shown = $derived(chosen?.label ?? placeholder ?? all.find((o) => !o.disabled)?.label ?? '');
  const empty = $derived(!chosen && placeholder !== undefined);
</script>

<label class="trigger" class:err={error} class:disabled={disabled} data-role="box" data-h="button">
  <span class="v" class:ph={empty} data-kata-placeholder={empty ? '' : undefined} aria-hidden="true"
    >{shown}</span
  >
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
      <option value="" disabled selected data-kata-placeholder>{placeholder}</option>
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
    position: relative;
    width: 100%;
    min-width: 0;
    justify-content: space-between;
    cursor: pointer;
    &:focus-within {
      border-color: color(blue-ink);
    }
  }
  // The chosen label, where the select drew its text (its line centred, not trimmed); a long one
  // ends with an ellipsis
  .v {
    display: block;
    flex: 1;
    @include ellipsis;
  }
  // Nothing chosen (the placeholder) is faint
  .ph {
    color: color(faint);
  }
  // The select over the whole control, transparent: it takes the press, the focus and the keys
  .trigger select {
    @include bare-control;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: auto;
    cursor: pointer;
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
