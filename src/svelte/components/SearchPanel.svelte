<script lang="ts" module>
  import type { IconSource } from '../icons.js';

  /** One result of a SearchPanel */
  export interface SearchItem {
    id: string;
    label: string;
    /** A second line under the name (where it is, what kind it is) */
    hint?: string;
    icon?: IconSource;
  }

  /** A group of results under a heading */
  export interface SearchGroup {
    label: string;
    items: SearchItem[];
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Panel from './Panel.svelte';
  import SearchInput from './SearchInput.svelte';
  import SectionHeader from './SectionHeader.svelte';
  import Stack from './Stack.svelte';
  import State from './State.svelte';
  import Text from './Text.svelte';
  import Toolbar from './Toolbar.svelte';

  // SearchPanel: a Panel that finds things. The head is a Toolbar with the title (and a close
  // button with onclose); the content starts with the input, in a Block, and the results follow
  // in groups, each a SectionHeader over a List. A result is a list item with an optional icon, its
  // name and an optional hint under it; pressing it calls onpick with its id. Enter in the input
  // picks the first result, and Escape clears the query.
  //
  // With filter (the default) the panel keeps the results whose name or hint contains the query,
  // ignoring case, and hides the groups left empty. Without it the application searches and passes
  // the results for the query it receives through onquery. When nothing shows, the panel shows
  // empty (the query has no result) or, while the query is empty, hint.
  //
  //   <SearchPanel {groups} bind:query onpick={(id) => focus(id)} onclose={close} />
  let {
    groups,
    query = $bindable(''),
    onquery,
    onpick,
    filter = true,
    title,
    placeholder,
    empty,
    hint,
    onclose,
    side = 'panel',
  }: {
    /** The results in groups, in order */
    groups: SearchGroup[];
    /** The query in the input */
    query?: string;
    /** Called with the query on every key stroke */
    onquery?: (query: string) => void;
    /** Called with the id of the result that is pressed */
    onpick?: (id: string) => void;
    /** Keep the results that contain the query; false when the application searches */
    filter?: boolean;
    /** The title in the head, and the name of the input */
    title?: string;
    /** The faint text in the empty input */
    placeholder?: string;
    /** What shows when the query has no result */
    empty?: string;
    /** What shows while the query is empty and there is nothing to show */
    hint?: string;
    /** Shows a close button in the head and is called when it is pressed */
    onclose?: () => void;
    /** The width of the panel, as Panel's side */
    side?: 'rail' | 'panel' | 'fill';
  } = $props();

  const name = $derived(title ?? getMessages().search);
  const q = $derived(query.trim().toLowerCase());
  const shown = $derived.by(() => {
    if (!filter || !q) return groups.filter((g) => g.items.length > 0);
    return groups
      .map((g) => ({
        label: g.label,
        items: g.items.filter((it) =>
          `${it.label}\n${it.hint ?? ''}`.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  });
  const message = $derived(q ? (empty ?? getMessages().noMatches) : hint);

  function oninput(e: Event & { currentTarget: HTMLInputElement }) {
    query = e.currentTarget.value;
    onquery?.(query);
  }
  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const first = shown[0]?.items[0];
      if (!first) return;
      e.preventDefault();
      onpick?.(first.id);
    } else if (e.key === 'Escape' && query) {
      e.preventDefault();
      e.stopPropagation();
      query = '';
      onquery?.('');
    }
  }
</script>

{#snippet close()}
  <Button variant="ghost" icon aria-label={getMessages().close} onclick={() => onclose?.()}>
    <Icon name="x" />
  </Button>
{/snippet}

<Panel {side} label={name}>
  {#snippet head()}
    <Toolbar title={name} rule tail={!!onclose} end={onclose ? close : undefined} />
  {/snippet}
  <Stack gap={0}>
    <Block>
      <SearchInput value={query} label={name} {placeholder} {oninput} {onkeydown} />
    </Block>
    {#if shown.length === 0}
      {#if message}<Block><State text={message} /></Block>{/if}
    {:else}
      {#each shown as group, g (g)}
        <SectionHeader label={group.label} flush>
          <List label={group.label}>
            {#each group.items as item (item.id)}
              <ListItem
                columns={item.icon ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)'}
                onclick={() => onpick?.(item.id)}
              >
                {#if item.icon}<Icon name={item.icon} />{/if}
                {#if item.hint}
                  <Stack gap="sm">
                    <Text clamp>{item.label}</Text>
                    <Text role="caption" muted clamp>{item.hint}</Text>
                  </Stack>
                {:else}
                  <Text clamp>{item.label}</Text>
                {/if}
              </ListItem>
            {/each}
          </List>
        </SectionHeader>
      {/each}
    {/if}
  </Stack>
</Panel>
