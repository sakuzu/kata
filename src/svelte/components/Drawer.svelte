<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';

  // Drawer: the panel that slides in from the left on a narrow screen, with the content of the rail
  // (a navigation or a list). It is the width of a drawer, has a strong line on its right, and lies
  // over a scrim; a press on the scrim or Escape closes it. It has no padding: list items hold their
  // own and text goes in a Block.
  //
  // It is placed absolutely in its frame, which must be a positioned element (the shell of the
  // application). inline draws it in the flow instead, without the scrim, for documentation.
  //
  //   <Drawer bind:open label="Navigation">…</Drawer>
  let {
    open = $bindable(false),
    label,
    inline = false,
    onclose,
    children,
  }: {
    open?: boolean;
    /** The accessible name of the drawer */
    label?: string;
    /** The same surface in the flow of a page, for documentation (open is ignored) */
    inline?: boolean;
    onclose?: () => void;
    children: Snippet;
  } = $props();

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  // Escape closes the drawer while it is open and goes no further
  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !open || inline) return;
    e.stopPropagation();
    close();
  }
</script>

<svelte:window onkeydowncapture={onKeyDown} />

{#if inline}
  <aside class="drawer" data-inline aria-label={label} data-role="panel">
    {@render children()}
  </aside>
{:else if open}
  <!-- The scrim is a button that closes the drawer -->
  <button class="scrim" type="button" aria-label={getMessages().close} onclick={close}></button>
  <aside class="drawer" aria-label={label} data-role="panel">
    {@render children()}
  </aside>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // The scrim is on the same layer as the drawer; the order of the elements puts the drawer on top
  .scrim {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: color(scrim);
    cursor: pointer;
    z-index: z(sheet);
  }
  .drawer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--kata-width-drawer);
    max-width: 100%;
    background: color(panel);
    color: color(text);
    border-right: bw() solid color(line-strong);
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: auto;
    z-index: z(sheet);
    @include scope-box(button);
    @include bundle;
    > :global(*) {
      flex: none;
    }
  }
  .drawer[data-inline] {
    position: static;
    flex: none;
  }
</style>
