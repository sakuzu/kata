<script lang="ts" module>
  /** The actions a Kebab offers */
  export type KebabAction =
    | 'settings'
    | 'share'
    | 'publish'
    | 'copy'
    | 'move'
    | 'ungroup'
    | 'delete';
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { MenuModel } from '../lib/menuModel.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import MenuDivider from './MenuDivider.svelte';
  import MenuItem from './MenuItem.svelte';
  import MenuList from './MenuList.svelte';

  // Kebab: the menu of actions on an item of a list or a card, behind a ghost icon button with an
  // ellipsis (its size is the one the container declares). The actions come in a fixed order; only
  // delete is destructive and comes last, after a divider, with an ellipsis after its name since a
  // confirmation follows. A destructive action is reached from here (or a context menu or the
  // Delete key), never from a Footer.
  //
  // With items, the menu is drawn from a model (MenuModel[]) instead, and onselect receives the id
  // of the item that was chosen.
  //
  //   <Kebab actions={['settings', 'copy', 'delete']} onaction={(a) => …} />
  //   <Kebab items={[{ id: 'rename', label: 'Rename' }]} onselect={(id) => …} />
  let {
    onaction,
    actions = ['settings', 'share', 'copy', 'move', 'delete'],
    items,
    onselect,
  }: {
    /** Called with the action that was chosen */
    onaction?: (action: KebabAction) => void;
    /** The actions to offer; they show in the fixed order whatever the order given */
    actions?: KebabAction[];
    /** A menu drawn from a model instead of the fixed actions */
    items?: MenuModel[];
    /** Called with the id of the item of the model that was chosen */
    onselect?: (id: string) => void;
  } = $props();

  const catalog = $derived([
    { a: 'settings', icon: 'settings-2', label: getMessages().settings },
    { a: 'share', icon: 'share-2', label: getMessages().share },
    { a: 'publish', icon: 'globe', label: getMessages().linkShare },
    { a: 'copy', icon: 'copy', label: getMessages().duplicate },
    { a: 'move', icon: 'corner-up-right', label: getMessages().move },
    { a: 'ungroup', icon: 'ungroup', label: getMessages().ungroup },
  ] as const);
  const main = $derived(catalog.filter((c) => actions.includes(c.a)));
  const hasDelete = $derived(actions.includes('delete'));
</script>

<Dropdown align="end" menu role="icon-button">
  {#snippet trigger(toggle, open)}
    <Button
      variant="ghost"
      icon
      aria-label={getMessages().actions}
      aria-haspopup="menu"
      aria-expanded={open}
      onclick={(e) => {
        e.stopPropagation();
        toggle();
      }}
    >
      <Icon name="ellipsis" />
    </Button>
  {/snippet}
  {#snippet panel(close)}
    {#if items}
      <MenuList {items} {onselect} onclose={close} />
    {:else}
      {#each main as item (item.a)}
        <MenuItem
          icon={item.icon}
          onclick={() => {
            onaction?.(item.a);
            close();
          }}>{item.label}</MenuItem
        >
      {/each}
      {#if hasDelete}
        {#if main.length}<MenuDivider />{/if}
        <MenuItem
          icon="trash-2"
          danger
          onclick={() => {
            onaction?.('delete');
            close();
          }}>{getMessages().delete}…</MenuItem
        >
      {/if}
    {/if}
  {/snippet}
</Dropdown>
