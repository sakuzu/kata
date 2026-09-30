<script lang="ts" module>
  /** One saved version of a document */
  export interface VersionEntry {
    id: string;
    /** Its name, or what the application calls an unnamed version */
    label: string;
    /** When it was saved, already written for the reader (2 hours ago, 3 May 14:20) */
    when: string;
    /** Who saved it */
    by: string;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Footer from './Footer.svelte';
  import Icon from './Icon.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import Panel from './Panel.svelte';
  import Stack from './Stack.svelte';
  import State from './State.svelte';
  import Text from './Text.svelte';
  import Toolbar from './Toolbar.svelte';

  // VersionsPanel: the saved versions of a document, newest first, in a Panel. The head is a
  // Toolbar with the title (and a close button with onclose). Each version is a list item of two
  // lines: its name, then when it was saved and by whom. Pressing a version calls onpreview with its
  // id; the application shows it and passes its id back as current, which selects the item.
  //
  // The first version is the latest. While another one is current, the Footer offers two actions:
  // back to the latest (onpreview with the latest id) and restore (onrestore with the current id).
  // The application confirms a restore if it needs to. The words come from the messages API.
  //
  //   <VersionsPanel {versions} current={shown} onpreview={(id) => (shown = id)} onrestore={restore} />
  let {
    versions,
    current,
    onpreview,
    onrestore,
    title,
    empty,
    onclose,
    side = 'panel',
  }: {
    /** The versions, newest first */
    versions: VersionEntry[];
    /** The id of the version shown */
    current?: string;
    /** Called with the id of the version that is pressed */
    onpreview?: (id: string) => void;
    /** Called with the id of the version shown, to make it the latest again */
    onrestore?: (id: string) => void;
    /** The title in the head */
    title?: string;
    /** What shows when there is no version */
    empty?: string;
    /** Shows a close button in the head and is called when it is pressed */
    onclose?: () => void;
    /** The width of the panel, as Panel's side */
    side?: 'rail' | 'panel' | 'fill';
  } = $props();

  const name = $derived(title ?? getMessages().versions);
  const latest = $derived(versions[0]?.id);
  // A version other than the latest is shown
  const past = $derived(
    current !== undefined && current !== latest && versions.some((v) => v.id === current),
  );
</script>

{#snippet close()}
  <Button variant="ghost" icon aria-label={getMessages().close} onclick={() => onclose?.()}>
    <Icon name="x" />
  </Button>
{/snippet}
{#snippet back()}
  <Button onclick={() => latest !== undefined && onpreview?.(latest)}>
    {getMessages().backToLatest}
  </Button>
{/snippet}
{#snippet restore()}
  <Button variant="primary" onclick={() => current !== undefined && onrestore?.(current)}>
    {getMessages().restore}
  </Button>
{/snippet}

<Panel {side} label={name}>
  {#snippet head()}
    <Toolbar title={name} rule tail={!!onclose} end={onclose ? close : undefined} />
  {/snippet}
  {#if versions.length === 0}
    <Block><State text={empty ?? getMessages().noVersions} /></Block>
  {:else}
    <List label={name} rows="two">
      {#each versions as v (v.id)}
        <ListItem
          columns="minmax(0, 1fr)"
          sel={v.id === current}
          aria-current={v.id === current ? 'true' : undefined}
          onclick={() => onpreview?.(v.id)}
        >
          <Stack gap="sm">
            <Text clamp>{v.label}</Text>
            <Text role="caption" muted clamp>{v.when} · {v.by}</Text>
          </Stack>
        </ListItem>
      {/each}
    </List>
  {/if}
  {#snippet foot()}
    {#if past}<Footer cancel={back} primary={restore} />{/if}
  {/snippet}
</Panel>
