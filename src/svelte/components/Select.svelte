<script lang="ts" generics="T extends string">
  import '../styles/components.css';
  import { tick } from 'svelte';
  import { follow, placeBelow } from '../lib/place.js';
  import Icon from './Icon.svelte';

  // Select: a select with a list of its own. The trigger is the control of a button with a chevron
  // on the right; the list opens below it, at least as wide as the trigger, with a check mark on
  // the left of the chosen option. Use it for five options or more, or options with a description
  // (Segmented for two to four, NativeSelect for long lists and phones). The height is the one the
  // container declares.
  //
  // The list is a popover, so it shows above everything, also inside a modal or a panel. It is
  // placed as a Dropdown is (lib/place): gap-xs below the trigger, upward when there is no room
  // below, gap-md inside the window, and it follows the trigger while open. The arrow keys move
  // between the options, Enter or Space chooses one, and a press outside, Escape or Tab closes the
  // list; Escape returns the focus to the trigger.
  //
  //   <Select {options} bind:value onchange={apply} />
  let {
    options,
    value = $bindable(),
    placeholder = '',
    id,
    ariaLabel,
    disabled = false,
    error = false,
    onchange,
  }: {
    options: { value: T; label: string; description?: string }[];
    value?: T;
    /** The text on the trigger while nothing is chosen, faint */
    placeholder?: string;
    id?: string;
    /** The accessible name where no <label for> names it */
    ariaLabel?: string;
    disabled?: boolean;
    error?: boolean;
    onchange?: (value: T) => void;
  } = $props();

  const listId = $props.id();
  const current = $derived(options.find((o) => o.value === value));

  let open = $state(false);
  let placed = $state(false);
  let triggerEl = $state<HTMLButtonElement>();
  let listEl = $state<HTMLDivElement>();
  let pos = $state({ top: 0, left: 0, width: 0, maxHeight: 0 });

  // Without the popover API (a test environment) the list is a plain fixed element
  const canPopover =
    typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function';

  function place() {
    if (!triggerEl || !listEl) return;
    const r = triggerEl.getBoundingClientRect();
    // Lined up with the trigger's start; at least as wide as the trigger
    const width = Math.max(listEl.offsetWidth, r.width);
    pos = { ...placeBelow(listEl, r, { align: 'start', width }), width: Math.round(r.width) };
  }

  function items(): HTMLElement[] {
    return listEl ? [...listEl.querySelectorAll<HTMLElement>('[role="option"]')] : [];
  }
  function focusAt(index: number) {
    const all = items();
    if (all.length === 0) return;
    all[((index % all.length) + all.length) % all.length]?.focus();
  }

  function show() {
    if (disabled || open) return;
    placed = false;
    open = true;
  }
  function close(returnFocus: boolean) {
    open = false;
    if (returnFocus) triggerEl?.focus();
  }
  function choose(next: T) {
    value = next;
    onchange?.(next);
    close(true);
  }

  $effect(() => {
    if (!open || !listEl || !triggerEl) return;
    const el = listEl;
    if (canPopover && !el.matches(':popover-open')) el.showPopover();
    void (async () => {
      await tick();
      place();
      placed = true;
      await tick();
      const i = options.findIndex((o) => o.value === value);
      focusAt(Math.max(0, i));
    })();
    return follow(triggerEl, el, place);
  });

  function onTriggerKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      show();
    }
  }
  function onListKey(e: KeyboardEvent) {
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusAt(at < 0 ? 0 : at + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusAt(at < 0 ? all.length - 1 : at - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusAt(all.length - 1);
    } else if (e.key === 'Escape') {
      // Escape closes the list and goes no further (a modal around it stays open)
      e.preventDefault();
      e.stopPropagation();
      close(true);
    } else if (e.key === 'Tab') {
      close(true);
    }
  }
  // A press outside the trigger and the list closes it; read in the capture phase, so that a
  // container that stops propagation does not keep it open
  function onPointerDown(e: PointerEvent) {
    if (!open) return;
    const target = e.target as Node;
    if (triggerEl?.contains(target) || listEl?.contains(target)) return;
    close(false);
  }
</script>

<svelte:window onpointerdowncapture={onPointerDown} />

<button
  bind:this={triggerEl}
  type="button"
  class="trigger"
  class:err={error}
  class:disabled={disabled}
  data-role="box"
  data-h="button"
  {id}
  {disabled}
  aria-label={ariaLabel}
  aria-haspopup="listbox"
  aria-expanded={open}
  aria-controls={open ? listId : undefined}
  onclick={() => (open ? close(false) : show())}
  onkeydown={onTriggerKey}
>
  {#if current}<span class="v">{current.label}</span>{:else}<span class="v ph" data-kata-placeholder
      >{placeholder}</span
    >{/if}
  <Icon name="chevron-down" />
</button>
{#if open}
  <div
    bind:this={listEl}
    id={listId}
    class="list"
    class:placed
    role="listbox"
    tabindex="-1"
    aria-label={ariaLabel}
    popover={canPopover ? 'manual' : undefined}
    onkeydown={onListKey}
    style:top={`${pos.top}px`}
    style:left={`${pos.left}px`}
    style:min-width={pos.width ? `${pos.width}px` : undefined}
    style:max-height={pos.maxHeight ? `${pos.maxHeight}px` : undefined}
  >
    {#each options as opt (opt.value)}
      <button
        type="button"
        class="option"
        class:two={!!opt.description}
        role="option"
        aria-selected={opt.value === value}
        tabindex="-1"
        data-role="list-item"
        data-h="list-item"
        onclick={() => choose(opt.value)}
      >
        <span class="chk">{#if opt.value === value}<Icon name="check" />{/if}</span>
        {#if opt.description}
          <span class="text">
            <span class="t">{opt.label}</span>
            <span class="t desc">{opt.description}</span>
          </span>
        {:else}
          <span class="t label">{opt.label}</span>
        {/if}
      </button>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .trigger {
    @include box;
    width: 100%;
    min-width: 0;
    justify-content: space-between;
    cursor: pointer;
    &[aria-expanded='true'] {
      border-color: color(blue-ink);
    }
  }
  // Text in a control, trimmed to its ink; a long value is one line with an ellipsis
  .v {
    display: block;
    @include trim;
    @include ellipsis;
  }
  .ph {
    color: color(faint);
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
  }
  // The list: the surface of a menu, a line and no padding, so that the options reach its edges.
  // It is at least 12rem wide and never wider than the window. The popover's own look is reset.
  .list {
    position: fixed;
    inset: auto;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: auto;
    background: color(panel);
    border: bw() solid color(line-strong);
    color: color(text);
    min-width: min(12rem, calc(100vw - #{gap(md)} * 2));
    max-width: calc(100vw - #{gap(md)} * 2);
    // Hidden until it is placed, so that it does not flash at the top of the window
    visibility: hidden;
  }
  .list.placed {
    visibility: visible;
  }
  // An option: the height of a list item, pad-md at the sides, the check mark's column on the left
  .option {
    display: flex;
    align-items: center;
    gap: gap(sm);
    width: 100%;
    min-height: h(list-item);
    padding-inline: pad(md);
    border: 0;
    background: none;
    color: inherit;
    @include text(body);
    text-align: start;
    cursor: pointer;
    flex: none;
    &:hover {
      background: color(raise);
    }
    @include focus-inside;
  }
  // An option with a description: the two lines gap-sm apart, pad-md above and below
  .option.two {
    padding-block: pad(md);
  }
  .chk {
    display: flex;
    width: h(icon);
    flex: none;
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: gap(sm);
    min-width: 0;
  }
  .t {
    display: block;
    min-width: 0;
    @include trim;
  }
  .label {
    flex: 1;
    @include ellipsis;
  }
  .desc {
    @include text(caption);
  }
</style>
