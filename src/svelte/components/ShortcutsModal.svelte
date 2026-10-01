<script lang="ts">
  import '../styles/components.css';
  import { isMacPlatform, type Shortcut, shortcutText } from '../lib/shortcuts.js';
  import { getMessages } from '../messages.js';
  import Kbd from './Kbd.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Modal from './Modal.svelte';
  import Section from './Section.svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';

  // ShortcutsModal: the list of keyboard shortcuts, in a Modal. One row for each shortcut: what it
  // does on the left, the key on the right, written as the platform writes it (formatShortcut), or
  // the keys of display joined with " / ". A hidden shortcut is not listed, and aliases are not
  // shown. Shortcuts without a group come first, without a heading; then one Section for each
  // group, in the order of groups, then in the order the groups first appear. run, when and
  // aliases are not read.
  // A Shell opens it with the help key; an application can also open it from a menu.
  //
  //   <ShortcutsModal bind:open {shortcuts} />
  let {
    open = $bindable(false),
    shortcuts,
    title,
    mac,
    groups: order,
    inline = false,
    onclose,
  }: {
    open?: boolean;
    /** The shortcuts to list; only key, label, group, display and hidden are read */
    shortcuts: Pick<Shortcut, 'key' | 'label' | 'group' | 'display' | 'hidden'>[];
    /** The title; the keyboardShortcuts string by default */
    title?: string;
    /** Writes the keys as a Mac does; by default, as the platform does */
    mac?: boolean;
    /** The order of the groups; the groups not in it follow, in the order they first appear */
    groups?: string[];
    /** The same surface in the flow of a page, for documentation */
    inline?: boolean;
    onclose?: () => void;
  } = $props();

  const onMac = $derived(mac ?? isMacPlatform());
  const listed = $derived(shortcuts.filter((s) => !s.hidden));
  const loose = $derived(listed.filter((s) => !s.group));
  const groups = $derived.by(() => {
    const out = new Map<string, typeof shortcuts>();
    for (const s of listed) {
      if (!s.group) continue;
      out.set(s.group, [...(out.get(s.group) ?? []), s]);
    }
    if (!order) return [...out];
    const rank = (g: string) => {
      const i = order.indexOf(g);
      return i === -1 ? order.length : i;
    };
    return [...out].sort(([a], [b]) => rank(a) - rank(b));
  });
</script>

{#snippet rows(list: typeof shortcuts)}
  <List>
    {#each list as s, i (`${i}:${s.key}`)}
      <ListItem columns="minmax(0, 1fr) auto" plain rule>
        <Text clamp>{s.label}</Text>
        <Kbd bare>{shortcutText(s, onMac)}</Kbd>
      </ListItem>
    {/each}
  </List>
{/snippet}

<Modal bind:open title={title ?? getMessages().keyboardShortcuts} {inline} {onclose}>
  <Stack gap={0}>
    {#if loose.length > 0}{@render rows(loose)}{/if}
    {#each groups as [group, list] (group)}
      <Section title={group} flush>{@render rows(list)}</Section>
    {/each}
  </Stack>
</Modal>
