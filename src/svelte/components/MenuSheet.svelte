<script lang="ts">
  import '../styles/components.css';
  import { tick } from 'svelte';
  import type { MenuModel } from '../lib/menuModel.js';
  import { getMessages } from '../messages.js';
  import MenuList from './MenuList.svelte';
  import Sheet from './Sheet.svelte';
  import Toolbar from './Toolbar.svelte';

  // MenuSheet: a menu on a narrow screen, in a Sheet that comes up from the bottom of the frame.
  // It takes the same model as AppMenu (MenuModel[]); a submenu takes the place of the list, under
  // a row that goes back. Choosing an item reports it and closes the sheet; a drag down, Escape or
  // the application (open) closes it too. The frame must be a positioned element, as for a Sheet.
  //
  //   <MenuSheet bind:open items={menu} onselect={run} title="Menu" />
  let {
    items,
    onselect,
    open = $bindable(false),
    onclose,
    title,
  }: {
    /** The model of the menu */
    items: MenuModel[];
    /** Called with the id of the item that was chosen */
    onselect?: (id: string) => void;
    /** The sheet shows */
    open?: boolean;
    /** Called when the sheet closes */
    onclose?: () => void;
    /** The title in the head of the sheet ("Menu" by default) */
    title?: string;
  } = $props();

  let stage = $state<'peek' | 'half' | 'full'>('half');
  let box = $state<HTMLElement>();
  const name = $derived(title ?? getMessages().menu);

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  // The first item takes the focus when the sheet opens
  $effect(() => {
    if (!open) return;
    void tick().then(() => box?.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
  });

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !open) return;
    e.stopPropagation();
    close();
  }
</script>

<svelte:window onkeydown={onKeyDown} />

{#if open}
  <Sheet bind:stage stages={['half', 'full']} closable onclose={close} label={name}>
    {#snippet head()}<Toolbar title={name} rule />{/snippet}
    <div class="items" role="menu" aria-label={name} bind:this={box}>
      <MenuList {items} {onselect} onclose={close} inline />
    </div>
  </Sheet>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .items {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
</style>
