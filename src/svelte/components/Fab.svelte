<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Fab: the main action of a small screen, floating over the stage. A square with the
  // height of a button, square corners and the solid fill. One per screen, and none while a modal is
  // open (the modal's primary action takes the fill). It shows an icon only, so it needs a label.
  //
  // It is placed absolutely in its positioned container; top, right, bottom and left are gap steps
  // (md from the bottom right by default). Giving top or left frees the opposite side.
  //
  //   <Fab label="Edit" icon="pencil" onclick={edit} />
  type Step = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type Place = 0 | Step;
  let {
    label,
    icon,
    onclick,
    disabled = false,
    top,
    right = 'md',
    bottom = 'md',
    left,
  }: {
    /** The name of the action */
    label: string;
    /** A name from the icons list, or an icon component */
    icon: IconSource;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    top?: Place;
    right?: Place;
    bottom?: Place;
    left?: Place;
  } = $props();

  function at(v: Place | undefined): string | undefined {
    if (v === undefined) return undefined;
    return v === 0 ? '0' : `var(--kata-gap-${v})`;
  }
  const r = $derived(left === undefined ? at(right) : undefined);
  const b = $derived(top === undefined ? at(bottom) : undefined);
</script>

<button
  class="fab"
  type="button"
  data-role="fab"
  data-h="button"
  aria-label={label}
  {disabled}
  {onclick}
  style:top={at(top)}
  style:right={r}
  style:bottom={b}
  style:left={at(left)}
>
  <Icon name={icon} />
</button>

<style lang="scss">
  @use '../styles/kata' as *;

  .fab {
    position: absolute;
    z-index: z(floating);
    width: h(button);
    height: h(button);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color(solid);
    color: color(on-solid);
    border: bw() solid color(line-strong);
    border-radius: 0;
    cursor: pointer;
    padding: 0;
    flex: none;
    transition: background-color 0.12s ease;
    &:hover:not(:disabled) {
      background: color(solid-hover);
    }
    &:active:not(:disabled) {
      background: color(solid-active);
      transition: none;
    }
    &:disabled {
      opacity: dim();
      cursor: default;
    }
  }
</style>
