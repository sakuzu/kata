<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import { toast } from '../toasts.svelte.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Toast from './Toast.svelte';

  // ToastHost: where the toasts of the toast store show. They stack at the bottom right of the
  // screen, gap-md from its edges, the newest at the bottom, at most three, gap-sm apart; each has
  // a close button. The store decides when each one goes. An application places one ToastHost at
  // its root and calls toast.show() or toast.error().
  //
  // The store has two kinds, info and error, so only an error has a red line; the other tones of
  // Toast are for a Toast placed by hand. inline stacks the toasts in the flow of the page, and
  // keeps its place while empty, for documentation.
  //
  //   <ToastHost />
  let {
    inline = false,
  }: {
    /** In the flow of the page, for documentation */
    inline?: boolean;
  } = $props();

  const MAX = 3;
  const items = $derived(toast.items.slice(-MAX));
</script>

{#if items.length > 0 || inline}
  <div
    class="host"
    data-role="floating"
    data-inline={inline ? '' : undefined}
    aria-live="polite"
  >
    {#each items as t (t.id)}
      <div class="slot">
        <Toast tone={t.kind === 'error' ? 'error' : 'info'}>
          {t.msg}
          {#snippet act()}
            <Button
              variant="ghost"
              icon
              aria-label={getMessages().close}
              onclick={() => toast.dismiss(t.id)}
            >
              <Icon name="x" />
            </Button>
          {/snippet}
        </Toast>
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .host {
    position: fixed;
    right: gap(md);
    bottom: gap(md);
    z-index: z(toast);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: gap(sm);
    max-width: calc(100% - #{gap(md)} * 2);
    pointer-events: none;
  }
  .host[data-inline] {
    position: static;
    max-width: 100%;
  }
  .slot {
    flex: none;
    pointer-events: auto;
    max-width: 100%;
  }
</style>
