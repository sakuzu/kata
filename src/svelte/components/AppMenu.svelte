<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import type { MenuModel } from '../lib/menuModel.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import MenuList from './MenuList.svelte';

  // AppMenu: the menu of an application behind one button, with submenus (File, Edit, View…).
  // The model is a MenuModel[]; its items at the root are mostly submenus, drawn by a MenuList in a
  // Dropdown. The trigger is a button with the label and a chevron, or with icon a ghost icon
  // button named by the label. A Topbar takes the same model for the menu of its brand, and a
  // MenuSheet shows it on a narrow screen.
  //
  //   <AppMenu label="Menu" items={menu} onselect={run} />
  let {
    items,
    onselect,
    label,
    icon,
    align = 'start',
    onOpenChange,
  }: {
    /** The model of the menu */
    items: MenuModel[];
    /** Called with the id of the item that was chosen */
    onselect?: (id: string) => void;
    /** The text of the trigger, or its accessible name with icon ("Menu" by default) */
    label?: string;
    /** An icon button instead of a text button */
    icon?: IconSource;
    /** The edge of the trigger the menu lines up with */
    align?: 'start' | 'end';
    /** Called whenever the menu opens or closes */
    onOpenChange?: (open: boolean) => void;
  } = $props();

  const name = $derived(label ?? getMessages().menu);
</script>

<Dropdown menu {align} role={icon ? 'icon-button' : 'anchor'} {onOpenChange}>
  {#snippet trigger(toggle, open)}
    {#if icon}
      <Button
        variant="ghost"
        icon
        aria-label={name}
        aria-haspopup="menu"
        aria-expanded={open}
        onclick={toggle}><Icon name={icon} /></Button
      >
    {:else}
      <Button trailing="chevron-down" aria-haspopup="menu" aria-expanded={open} onclick={toggle}
        >{name}</Button
      >
    {/if}
  {/snippet}
  {#snippet panel(close)}
    <MenuList {items} {onselect} onclose={close} />
  {/snippet}
</Dropdown>
