<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { IconName } from '../icons.js';
  import Icon from './Icon.svelte';

  // Toast: a short notice in a corner of the screen. It has the panel color, a strong line, the
  // width of a toast (never wider than its place) and pad-md inside. The tone colors its icon
  // (info blue, warn yellow, error red, ok green); an error also turns the line red. One action
  // (undo, close) sits at the right end, as a small button; when it does not fit, it moves below
  // the text. ToastHost decides where toasts stack and when they go; Toast is the look of one.
  //
  //   <Toast tone="ok">Saved{#snippet act()}<Button>Undo</Button>{/snippet}</Toast>
  let {
    tone = 'info',
    children,
    act,
  }: {
    tone?: 'info' | 'warn' | 'error' | 'ok';
    children: Snippet;
    /** One action at the right end */
    act?: Snippet;
  } = $props();

  const MARK: Record<string, IconName> = {
    info: 'info',
    warn: 'triangle-alert',
    error: 'circle-alert',
    ok: 'circle-check',
  };
</script>

<div class="toast {tone}" data-inset data-edge-pass data-role="toast" role={tone === 'error' ? 'alert' : 'status'}>
  <div class="line" data-edge-pass>
    <span class="mark"><Icon name={MARK[tone]} /></span>
    <p class="text" data-ink>{@render children()}</p>
  </div>
  {#if act}<div class="act">{@render act()}</div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .toast {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: gap(sm);
    width: var(--kata-width-toast);
    max-width: 100%;
    @include container;
    @include surface(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    flex: none;
    @include text(body);
    @include scope-box(button-sm);
  }
  // The icon and the text stay together, on their first baseline; only the action moves to the
  // next line. The line and the action are placed side by side, so both are at the edges of the
  // toast (data-edge-pass)
  .line {
    display: flex;
    align-items: baseline;
    gap: gap(sm);
    flex: 1 1 12em;
    min-width: 0;
  }
  // The icon's seat: the icon's height, with the baseline of a trimmed line centred in it, so the
  // icon is centred on the ink of the first line of the text, wherever the text wraps
  .mark {
    @include seat(h(icon));
  }
  .text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
  }
  .act {
    margin-left: auto;
    flex: none;
    display: flex;
    align-items: center;
    gap: gap(sm);
  }
  .info .mark {
    color: color(blue-ink);
  }
  .warn .mark {
    color: color(yellow-ink);
  }
  .error {
    border-color: color(red-ink);
    .mark {
      color: color(red-ink);
    }
  }
  .ok .mark {
    color: color(green-ink);
  }
</style>
