<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Panel from './Panel.svelte';
  import Stack from './Stack.svelte';
  import Stat from './Stat.svelte';
  import Stats from './Stats.svelte';
  import Toolbar from './Toolbar.svelte';

  // SelectionSummary: the panel of a selection of several things. The head is a Toolbar with the
  // number selected (the messages API writes it, or title), the actions of end and a close button
  // with onclose. The content is, in order: the count of each kind as Stats in a Block, the fields
  // that edit what the things share (a snippet, usually SectionHeader groups), and the actions on
  // the whole selection in a Block. The panel knows nothing of the kinds; the application counts
  // them and names them.
  //
  //   <SelectionSummary count={5} kinds={[{ label: 'Shapes', count: 3 }, { label: 'Notes', count: 2 }]}>
  //     {#snippet fields()}<SectionHeader label="Colour">…</SectionHeader>{/snippet}
  //     {#snippet actions()}<Row wrap><Button>Group</Button></Row>{/snippet}
  //   </SelectionSummary>
  let {
    count,
    kinds = [],
    title,
    fields,
    actions,
    end,
    onclose,
    side = 'panel',
  }: {
    /** The number of things selected */
    count: number;
    /** The number of each kind, in order */
    kinds?: { label: string; count: number }[];
    /** The title in the head; by default the number selected */
    title?: string;
    /** The editors of what the things share (a snippet) */
    fields?: Snippet;
    /** The actions on the whole selection (a snippet) */
    actions?: Snippet;
    /** Icon buttons at the end of the head, before the close button (a snippet) */
    end?: Snippet;
    /** Shows a close button in the head and is called when it is pressed */
    onclose?: () => void;
    /** The width of the panel, as Panel's side */
    side?: 'rail' | 'panel' | 'fill';
  } = $props();

  const name = $derived(title ?? getMessages().selected({ count }));
</script>

{#snippet headEnd()}
  {@render end?.()}
  {#if onclose}
    <Button variant="ghost" icon aria-label={getMessages().close} onclick={() => onclose?.()}>
      <Icon name="x" />
    </Button>
  {/if}
{/snippet}

<Panel {side} label={name}>
  {#snippet head()}
    <Toolbar title={name} rule tail={!!(onclose || end)} end={onclose || end ? headEnd : undefined} />
  {/snippet}
  <Stack gap={0}>
    {#if kinds.length}
      <Block>
        <Stats>
          {#each kinds as kind, i (i)}
            <Stat label={kind.label} value={String(kind.count)} />
          {/each}
        </Stats>
      </Block>
    {/if}
    {@render fields?.()}
    {#if actions}<Block>{@render actions()}</Block>{/if}
  </Stack>
</Panel>
