<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { IconName } from '../icons.js';
  import Icon from './Icon.svelte';

  // Banner: a notice in the flow of a page or a panel. Its line takes the color of its tone (info
  // blue, warn yellow, error red, ok green) and so does its icon; the padding is pad-md. The icon
  // sits in a seat and is centred on the ink of the first line of the text. An action (act) sits
  // at the right end, on the baseline of the first line; when it does not fit beside the text, it
  // moves below it. A notice of several lines puts them in a Stack. floating gives it the panel surface,
  // for a notice over the stage; the application places it.
  //
  //   <Banner tone="warn">The trial ends in 3 days{#snippet act()}<Button>Renew</Button>{/snippet}</Banner>
  let {
    tone,
    floating = false,
    label,
    children,
    act,
  }: {
    tone: 'info' | 'warn' | 'error' | 'ok';
    /** The panel surface, for a notice over the stage */
    floating?: boolean;
    /** The accessible name of the notice, when it is referred to by name */
    label?: string;
    children: Snippet;
    /** An action at the right end */
    act?: Snippet;
  } = $props();

  const MARK: Record<string, IconName> = {
    info: 'info',
    warn: 'triangle-alert',
    error: 'circle-alert',
    ok: 'circle-check',
  };
</script>

<div
  class="banner {tone}"
  class:floating
  data-inset
  data-role="banner"
  role={tone === 'error' ? 'alert' : 'status'}
  aria-label={label}
>
  <div class="line">
    <span class="mark"><Icon name={MARK[tone]} /></span>
    <!-- A div, since the text can be a Stack of several lines -->
    <div class="text">{@render children()}</div>
  </div>
  {#if act}<div class="act">{@render act()}</div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .banner {
    border: bw() solid color(line-strong);
    @include container;
    display: flex;
    flex-wrap: wrap;
    // The first line of the text and the action share one baseline
    align-items: baseline;
    gap: gap(sm);
    color: color(text);
    min-width: 0;
    @include text(body);
    @include scope-box(button);
  }
  .floating {
    background: color(panel);
  }
  // The icon and the text stay together, on their first baseline; only the action moves to the
  // next line
  .line {
    display: flex;
    align-items: baseline;
    gap: gap(sm);
    flex: 1 1 12em;
    min-width: 0;
  }
  // The icon's seat: the icon's height, with the baseline of a trimmed line centred in it, so the
  // icon is centred on the ink of the first line, whether the text is trimmed or not
  .mark {
    @include seat(h(icon));
  }
  // The line takes its baseline from the first line of the text
  .text {
    flex: 1 1 auto;
    min-width: 0;
    align-self: baseline;
  }
  // Below the text, the action shrinks to the container and its text ends with an ellipsis
  .act {
    margin-left: auto;
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
    max-width: 100%;
    > :global(*) {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }
  }
  .info {
    border-color: color(blue-ink);
    .mark {
      color: color(blue-ink);
    }
  }
  .warn {
    border-color: color(yellow-ink);
    .mark {
      color: color(yellow-ink);
    }
  }
  .error {
    border-color: color(red-ink);
    .mark {
      color: color(red-ink);
    }
  }
  .ok {
    border-color: color(green-ink);
    .mark {
      color: color(green-ink);
    }
  }
</style>
