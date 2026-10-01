<script lang="ts">
  import '../styles/components.css';
  import { type Snippet, untrack } from 'svelte';
  import type { Action } from 'svelte/action';
  import { hitRect, placeTip, tipBounds, tipHost } from '../lib/tipPlace.js';

  // Tooltip: a short word that explains the control it wraps, with an optional key hint. It is the
  // inverse of the page (the text color as the surface), in the caption role, as high as a small
  // button with pad-sm at the sides. The name belongs to the control inside (its aria-label), so
  // the tooltip is aria-hidden and is not read twice. The application passes the words; the component
  // has none of its own.
  //
  // It shows on hover after a short wait, so a pointer that only passes by does not show it, and
  // at once on keyboard focus. It hides at once: on leaving, on a press, on a scroll and on a
  // resize. It goes above its control, or below, right or left, whichever fits first, and never
  // covers the control. It is moved to the body (or to the open modal dialog it is in, or to the
  // nearest data-kata-root when kata is embedded in a page it does not own), so that no container
  // clips it or moves its reference.
  //
  // The wrapper only holds its content, so it shows the layout the content's role: box for a
  // control with a line, icon-button for a borderless icon button (whose area of the pointer is
  // larger than its icon). inline draws the tooltip beside its control, always shown, for
  // documentation.
  //
  //   <Tooltip text="Share" shortcut="⇧S"><Button …>…</Button></Tooltip>
  let {
    text,
    shortcut,
    role = 'block',
    keep = false,
    inline = false,
    children,
  }: {
    /** The word; without it nothing shows */
    text?: string;
    /** A key hint, already written for the platform (⌘Z) */
    shortcut?: string;
    /** The role shown to the layout: box for a control, icon-button for an icon button */
    role?: 'block' | 'box' | 'icon-button';
    /** Copies data-keep to the wrapper, for a container that shows its content only on hover */
    keep?: boolean;
    /** Always shown beside its control, in the flow of the page, for documentation */
    inline?: boolean;
    children: Snippet;
  } = $props();

  // The wait before it shows on hover, in ms
  const DELAY = 400;

  // Read only in event handlers and actions, never in the template, so it is not state (as state,
  // clearing bind:this while the template tears down would be a write during rendering)
  // svelte-ignore non_reactive_update
  let wrap: HTMLElement | undefined;
  let anchor = $state<DOMRect | null>(null);
  let gone = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer() {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
  }

  const hasText = $derived(!!text?.trim());
  function show() {
    clearTimer();
    if (gone || !wrap || !hasText) return;
    anchor = hitRect(wrap, role);
  }

  // Also called while the wrapper is being removed (its content leaves the page and fires
  // pointerleave or focusout), so the write is untracked
  function hide() {
    clearTimer();
    if (gone || anchor === null) return;
    untrack(() => {
      anchor = null;
    });
  }

  // Keyboard focus only (:focus-visible): a press also focuses, and the tooltip should not stay
  // after it
  const watch: Action<HTMLElement> = (node) => {
    const onEnter = () => {
      clearTimer();
      timer = setTimeout(show, DELAY);
    };
    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement | null)?.matches?.(':focus-visible')) show();
    };
    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointerleave', hide);
    node.addEventListener('pointerdown', hide);
    node.addEventListener('focusin', onFocusIn);
    node.addEventListener('focusout', hide);
    return {
      destroy() {
        gone = true;
        clearTimer();
        node.removeEventListener('pointerenter', onEnter);
        node.removeEventListener('pointerleave', hide);
        node.removeEventListener('pointerdown', hide);
        node.removeEventListener('focusin', onFocusIn);
        node.removeEventListener('focusout', hide);
      },
    };
  };

  // Moves the tooltip to its host and places it; a scroll or a resize hides it
  const tip: Action<HTMLElement, DOMRect> = (node, rect) => {
    tipHost(wrap).appendChild(node);
    placeTip(node, rect, wrap ? tipBounds(wrap) : undefined);
    const close = () => hide();
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return {
      update(next: DOMRect) {
        placeTip(node, next, wrap ? tipBounds(wrap) : undefined);
      },
      destroy() {
        document.removeEventListener('scroll', close, true);
        window.removeEventListener('resize', close);
        node.remove();
      },
    };
  };
</script>

{#snippet face()}
  <span class="t">{text}</span>{#if shortcut}<span class="kbd"><span class="t">{shortcut}</span></span>{/if}
{/snippet}

{#if inline}
  <span class="pair">
    <span class="seat" data-role={role}>{@render children()}</span>
    {#if hasText}<span class="tip inline" data-h="button-sm" aria-hidden="true">{@render face()}</span>{/if}
  </span>
{:else}
  <span class="seat" data-role={role} data-keep={keep ? '' : undefined} bind:this={wrap} use:watch>
    {@render children()}
    {#if anchor && hasText}
      <span class="tip" data-h="button-sm" aria-hidden="true" use:tip={anchor}>{@render face()}</span>
    {/if}
  </span>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .seat {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }
  // The placement (left and top) is set by tipPlace; the tooltip is on the layer of menus
  .tip {
    position: fixed;
    z-index: z(menu);
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    gap: gap(sm);
    width: max-content;
    flex: none;
    height: h(button-sm);
    padding: 0 pad(sm);
    background: color(text);
    @include text(caption);
    color: color(ground);
    white-space: nowrap;
  }
  // The documentation form: the control, then the tooltip gap-sm to its right
  .pair {
    display: inline-flex;
    align-items: center;
    gap: gap(sm);
    max-width: 100%;
  }
  .tip.inline {
    position: static;
  }
  .t {
    display: block;
    min-width: 0;
    @include trim;
  }
  // The key hint has a box of its own (the height of a badge, pad-2xs at the sides), so that a key
  // of one letter does not run into the word
  .kbd {
    display: inline-flex;
    align-items: center;
    height: h(badge);
    padding: 0 pad(2xs);
    border: bw() solid color-mix(in srgb, color(ground) 40%, transparent);
    color: inherit;
    font-family: var(--kata-font-mono);
    white-space: nowrap;
    > .t {
      font-family: inherit;
    }
  }
</style>
