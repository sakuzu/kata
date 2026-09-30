<script lang="ts" generics="T extends string">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Segmented: an exclusive switch between two to four options. Each option is a control of the
  // height its container declares (a button's, or a small button's), and neighbours share one
  // line. The chosen option takes the solid surface; the outer line stays line-strong. The text is
  // trimmed to its ink and centred. Five options or more are a Select. The group is one control, so
  // its root is a box too. It does not wrap and does not shrink its padding: when it does not fit,
  // it scrolls sideways without a scrollbar.
  //
  //   <Segmented bind:value options={[{ value: 'grid', label: 'Grid' }, …]} ariaLabel="View" />
  //
  // An option with an icon and no label is square. When the value is derived from elsewhere, pass
  // value and onchange instead of binding it.
  let {
    options,
    value = $bindable(),
    ariaLabel,
    onchange,
  }: {
    options: {
      value: T;
      label?: string;
      icon?: IconSource;
      /** The accessible name of an option with an icon only */
      ariaLabel?: string;
      disabled?: boolean;
    }[];
    value: T;
    /** The name of the group (for example View) */
    ariaLabel?: string;
    onchange?: (value: T) => void;
  } = $props();
</script>

<div class="seg" data-role="box" role="group" aria-label={ariaLabel}>
  {#each options as opt (opt.value)}
    <button
      class="opt"
      class:on={value === opt.value}
      class:icon={!!opt.icon && !opt.label}
      type="button"
      data-role="box"
      data-h="button"
      disabled={opt.disabled}
      aria-label={opt.ariaLabel}
      aria-pressed={value === opt.value}
      onclick={() => {
        value = opt.value;
        onchange?.(opt.value);
      }}
    >
      {#if opt.icon}<Icon name={opt.icon} />{/if}{#if opt.label}<span class="t">{opt.label}</span>{/if}
    </button>
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .seg {
    display: inline-flex;
    flex: none;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  // Each option is a control; from the second on, the line on its left is its neighbour's
  .opt {
    @include box;
    cursor: pointer;
    flex: none;
    min-width: 0;
    &:hover:not(.on):not(:disabled) {
      background: color(raise);
    }
    &:active:not(:disabled) {
      background: color(raise-2);
      transition: none;
    }
    &:disabled {
      opacity: dim();
      cursor: default;
    }
    & + & {
      border-left-width: 0;
    }
    > :global(svg) {
      flex: none;
    }
    .t {
      display: block;
      min-width: 0;
      @include trim;
    }
  }
  .on {
    background: color(solid);
    color: color(on-solid);
  }
  .icon {
    width: box-h();
    padding: 0;
    justify-content: center;
  }
  // Options sit edge to edge, so the ring is drawn inside
  .opt {
    @include focus-inside;
  }
</style>
