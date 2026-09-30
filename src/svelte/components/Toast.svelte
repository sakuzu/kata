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

<div class="toast {tone}" data-inset data-role="toast" role={tone === 'error' ? 'alert' : 'status'}>
  <span class="mark"><Icon name={MARK[tone]} /></span>
  <p class="text">{@render children()}</p>
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
    background: color(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    flex: none;
    @include text(body);
    @include scope-box(button-sm);
  }
  .mark {
    display: flex;
    align-items: center;
    flex: none;
  }
  .text {
    flex: 1 1 12em;
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
