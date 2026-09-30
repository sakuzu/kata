<script lang="ts">
  import '../styles/components.css';
  import { formatShortcut, isMacPlatform, type Shortcut } from '../lib/shortcuts.js';
  import { getMessages } from '../messages.js';
  import Kbd from './Kbd.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Modal from './Modal.svelte';
  import Section from './Section.svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';

  // ShortcutsModal: the list of keyboard shortcuts, in a Modal. One row for each shortcut: what it
  // does on the left, the key on the right, written as the platform writes it (formatShortcut).
  // Shortcuts without a group come first, without a heading; then one Section for each group, in
  // the order the groups first appear. Only the label and the key are read; run and when are not.
  // A Shell opens it with the help key; an application can also open it from a menu.
  //
  //   <ShortcutsModal bind:open {shortcuts} />
  let {
    open = $bindable(false),
    shortcuts,
    title,
    mac,
    inline = false,
    onclose,
  }: {
    open?: boolean;
    /** The shortcuts to list; only key, label and group are read */
    shortcuts: Pick<Shortcut, 'key' | 'label' | 'group'>[];
    /** The title; the keyboardShortcuts string by default */
    title?: string;
    /** Writes the keys as a Mac does; by default, as the platform does */
    mac?: boolean;
    /** The same surface in the flow of a page, for documentation */
    inline?: boolean;
    onclose?: () => void;
  } = $props();

  const onMac = $derived(mac ?? isMacPlatform());
  const loose = $derived(shortcuts.filter((s) => !s.group));
  const groups = $derived.by(() => {
    const out = new Map<string, typeof shortcuts>();
    for (const s of shortcuts) {
      if (!s.group) continue;
      out.set(s.group, [...(out.get(s.group) ?? []), s]);
    }
    return [...out];
  });
</script>

{#snippet rows(list: typeof shortcuts)}
  <List>
    {#each list as s, i (`${i}:${s.key}`)}
      <ListItem columns="minmax(0, 1fr) auto" plain rule>
        <Text clamp>{s.label}</Text>
        <Kbd bare>{formatShortcut(s.key, onMac)}</Kbd>
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
