<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Icon from './Icon.svelte';

  // Chip: a value that can be removed. Chosen values sit in a row, one Chip each, and the ✕ on the
  // right removes one. It can be pressed, so it is a rectangle, with the height of a small button.
  // The ✕ is a square of a badge's height; its hit area and its hover surface are that square.
  // A Chip without a remove button is a value that can be pressed. A state (Badge) or a kind (Tag)
  // is not a Chip.
  //
  //   <Chip onremove={() => drop(v)}>{v}</Chip>
  //   <Chip onclick={edit} onremove={drop}>Status is public</Chip>   the text can be pressed too
  let {
    onremove,
    onclick,
    removeLabel,
    children,
  }: {
    /** Removes the value; without it no ✕ shows */
    onremove?: () => void;
    /** Makes the text pressable (to edit the value, for example) */
    onclick?: () => void;
    /** The accessible name of the ✕ (default: the removeValue message) */
    removeLabel?: string;
    children: Snippet;
  } = $props();
</script>

<span class="chip" class:tail={!!onremove} data-role="box" data-h="button-sm">
  {#if onclick}
    <button type="button" class="text press" {onclick}>{@render children()}</button>
  {:else}
    <span class="text">{@render children()}</span>
  {/if}
  {#if onremove}
    <button
      type="button"
      class="x"
      aria-label={removeLabel ?? getMessages().removeValue}
      onclick={onremove}
    >
      <Icon name="x" />
    </button>
  {/if}
</span>

<style lang="scss">
  @use '../styles/kata' as *;

  .chip {
    display: inline-flex;
    align-items: center;
    gap: gap(2xs);
    height: h(button-sm);
    padding-inline: pad(sm);
    border: bw() solid color(line-strong);
    background: color(raise);
    @include text(body);
    white-space: nowrap;
    max-width: 100%;
    flex: none;
  }
  // The ✕ carries its own white space, so the right side is narrower
  .tail {
    padding-inline-end: pad(2xs);
  }
  // The text is trimmed to its ink and centred; a long value ends with an ellipsis
  .text {
    display: block;
    @include trim;
    @include ellipsis;
  }
  // Pressable text: a bare button (the chip draws the outline)
  .press {
    border: 0;
    background: none;
    padding: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .x {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(badge);
    height: h(badge);
    border: 0;
    background: transparent;
    padding: 0;
    color: color(muted);
    cursor: pointer;
    flex: none;
    &:hover {
      color: color(text);
      background: color(raise-2);
    }
  }
</style>
