<script lang="ts" module>
  import type { IconSource } from '../icons.js';

  /** One place that things come from in a SourcePicker */
  export interface PickerSource {
    id: string;
    label: string;
    /** A second line under the name */
    description?: string;
    icon?: IconSource;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { createNarrow } from '../lib/viewport.svelte.js';
  import { getMessages } from '../messages.js';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Modal from './Modal.svelte';
  import Split from './Split.svelte';
  import Stack from './Stack.svelte';
  import Tabs from './Tabs.svelte';
  import Text from './Text.svelte';

  // SourcePicker: the frame of a dialog that adds something from one of several places (the files
  // of the device, a library, a link). It is a Modal of the widest size whose body is split: the
  // places on the left, a List in a nav, and the detail of the current place on the right, in a
  // Block. The application draws the detail with the detail snippet, which receives the current
  // place. Pressing a place calls onpick with its id; the application passes it back as current.
  //
  // Below 48rem the modal fills the screen and the places become Tabs above the detail. The Footer
  // holds a close button and, with primary, the action that adds what was chosen.
  //
  //   <SourcePicker bind:open title="Add" {sources} current={place} onpick={(id) => (place = id)}>
  //     {#snippet detail(source)}…{/snippet}
  //   </SourcePicker>
  let {
    open = $bindable(false),
    title,
    sources,
    current,
    onpick,
    detail,
    primary,
    onclose,
    inline = false,
  }: {
    open?: boolean;
    title: string;
    /** The places, in order */
    sources: PickerSource[];
    /** The id of the current place */
    current?: string;
    /** Called with the id of the place that is pressed */
    onpick?: (id: string) => void;
    /** The detail of the current place (a snippet that receives it) */
    detail: Snippet<[PickerSource]>;
    /** The action that adds what was chosen, at the end of the Footer (a snippet) */
    primary?: Snippet;
    /** Called once when the dialog closes */
    onclose?: () => void;
    /** The same surface in the flow of a page, for documentation */
    inline?: boolean;
  } = $props();

  const narrowState = createNarrow(48);
  $effect(narrowState.start);
  const narrow = $derived(narrowState.current);
  const chosen = $derived(sources.find((s) => s.id === current));
  const tabs = $derived(sources.map((s) => ({ id: s.id, label: s.label })));
</script>

{#snippet close()}<Button onclick={() => (open = false)}>{getMessages().close}</Button>{/snippet}

{#snippet pane()}
  <Block>
    {#if chosen}{@render detail(chosen)}{/if}
  </Block>
{/snippet}

<Modal bind:open {title} size="xl" flush {inline} {onclose} cancel={close} {primary}>
  {#if narrow}
    <Tabs {tabs} current={current ?? ''} label={title} onselect={(id) => onpick?.(id)} />
    {@render pane()}
  {:else}
    <Split>
      <nav aria-label={title}>
        <List>
          {#each sources as source (source.id)}
            <ListItem
              columns={source.icon ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)'}
              sel={source.id === current}
              aria-current={source.id === current ? 'true' : undefined}
              onclick={() => onpick?.(source.id)}
            >
              {#if source.icon}<Icon name={source.icon} />{/if}
              {#if source.description}
                <Stack gap="sm">
                  <Text clamp>{source.label}</Text>
                  <Text role="caption" muted clamp>{source.description}</Text>
                </Stack>
              {:else}
                <Text clamp>{source.label}</Text>
              {/if}
            </ListItem>
          {/each}
        </List>
      </nav>
      {#snippet main()}{@render pane()}{/snippet}
    </Split>
  {/if}
</Modal>
