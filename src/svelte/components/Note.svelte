<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../icons.js';
  import { clampTip } from '../lib/clampTip.js';
  import Icon from './Icon.svelte';

  // Note: a remark without a line or a surface: one sentence in the caption role, muted. tone
  // colors it (warn yellow, error red). An icon is optional; it sits in a seat and is centred on
  // the ink of the first line, in a layout and inside a control alike. A notice with a line is a Banner; the remark under an input is the note of
  // its Field. Inside a control (a list item) the text is trimmed to its ink; clamp keeps it to one
  // line with an ellipsis, and the full text shows on hover.
  //
  //   <Note>Importing does not change the original file</Note>
  //   <Note tone="warn" icon="triangle-alert">This cannot be undone</Note>
  //   <Note clamp>The link is broken</Note>
  let {
    tone,
    icon,
    clamp = false,
    children,
  }: {
    /** warn (yellow) or error (red); muted without it */
    tone?: 'warn' | 'error';
    /** An icon before the text (a name or a component) */
    icon?: IconSource;
    /** One line with an ellipsis; the full text shows on hover */
    clamp?: boolean;
    children: Snippet;
  } = $props();
</script>

<div class="note {tone ?? ''}" class:ico={!!icon} data-role="caption" data-ink>
  {#if icon}<span class="mark"><Icon name={icon} /></span>{/if}
  {#if clamp}
    <p class="text clamp" use:clampTip>{@render children()}</p>
  {:else}
    <p class="text">{@render children()}</p>
  {/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // Without an icon it is a block, so that the trim at the edge of a container reaches its text
  .note {
    display: block;
    min-width: 0;
    color: color(muted);
    font-size: fs(caption);
    line-height: lh(prose);
  }
  // The icon's seat and the text align by their first baseline
  .note.ico {
    display: flex;
    align-items: baseline;
    gap: gap(sm);
  }
  // The icon's seat: the icon's height, with the baseline of a trimmed line centred in it, so the
  // icon is centred on the ink of the first line whether the text is trimmed or not
  .mark {
    @include seat(h(icon));
  }
  // In a layout it keeps its line box; inside a control it is trimmed to its ink
  .text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
  }
  :global([data-h]) .text {
    @include trim;
  }
  .clamp {
    line-height: lh(caption);
    @include ellipsis;
  }
  .warn {
    color: color(yellow-ink);
  }
  .error {
    color: color(red-ink);
  }
</style>
