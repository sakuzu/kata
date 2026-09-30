<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../icons.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import InlineEdit from './InlineEdit.svelte';
  import Panel from './Panel.svelte';
  import Stack from './Stack.svelte';
  import Tabs from './Tabs.svelte';
  import Text from './Text.svelte';
  import Toolbar from './Toolbar.svelte';

  // InspectorFrame: the panel that shows the thing selected and lets it be changed. The head is a
  // Toolbar with an optional icon, the name (changed where it stands with InlineEdit, or a title
  // when it cannot be changed), an optional second line, the application's controls (head) and a
  // close button. The tabs, when there are several views, are a second Toolbar under it; the
  // content is the sections of the current tab, stacked with gap 0; end is the foot (a Footer).
  //
  // The frame shows the name it is given. When the name is committed, ontitle receives it trimmed;
  // the application updates title (at once), or the name goes back to title, so a name the
  // application does not take (an empty one, say) is not left on screen.
  //
  //   <InspectorFrame title={name} ontitle={rename} {tabs} bind:current onclose={close}>
  //     {#if current === 'style'}<InspectorSection title="Fill">…</InspectorSection>{/if}
  //   </InspectorFrame>
  let {
    title,
    ontitle,
    titleEditable = true,
    placeholder,
    subtitle,
    icon,
    tabs = [],
    current = $bindable(tabs[0]?.id ?? ''),
    onselect,
    head,
    end,
    onclose,
    side = 'panel',
    children,
  }: {
    /** The name of the thing shown */
    title: string;
    /** Called with the name committed, trimmed; the name can be changed only with it */
    ontitle?: (name: string) => void;
    /** false shows the name as a title that cannot be changed */
    titleEditable?: boolean;
    /** The action shown while the name is empty (the addName message by default) */
    placeholder?: string;
    /** A second line under the name (the kind of the thing, a count) */
    subtitle?: string;
    /** An icon before the name */
    icon?: IconSource;
    /** The views of the thing; with none, the head has no tabs */
    tabs?: { id: string; label: string }[];
    /** The id of the current tab */
    current?: string;
    /** Called with the id of the tab that is opened */
    onselect?: (id: string) => void;
    /** More controls in the head, icon buttons before the close button (a snippet) */
    head?: Snippet;
    /** The foot of the panel, a Footer with the actions (a snippet) */
    end?: Snippet;
    /** Shows a close button in the head and is called when it is pressed */
    onclose?: () => void;
    /** The width of the panel, as Panel's side */
    side?: 'rail' | 'panel' | 'fill';
    /** The sections of the current tab */
    children: Snippet;
  } = $props();

  const editable = $derived(titleEditable && !!ontitle);
  const action = $derived(placeholder ?? getMessages().addName);
  // The name on screen. It follows title, and goes back to it after a commit the application did
  // not take.
  let name = $derived(title);

  function commit(next: string) {
    ontitle?.(next);
    if (title !== next) name = title;
  }

  function select(id: string) {
    current = id;
    onselect?.(id);
  }
</script>

{#snippet headEnd()}
  {@render head?.()}
  {#if onclose}
    <Button variant="ghost" icon aria-label={getMessages().close} onclick={() => onclose?.()}>
      <Icon name="x" />
    </Button>
  {/if}
{/snippet}

{#snippet lead()}{#if icon}<Icon name={icon} />{/if}{/snippet}

{#snippet nameOf()}
  {#if editable}
    <span class="name">
      <InlineEdit
        bind:value={name}
        title
        placeholder={action}
        label={name ? getMessages().rename : action}
        onCommit={commit}
      />
    </span>
  {:else}
    <Text role="h2" as="h2" clamp>{title}</Text>
  {/if}
{/snippet}

<Panel {side} foot={end} label={title || action}>
  {#snippet head()}
    <Toolbar
      title={!editable && !subtitle ? title : undefined}
      rule={tabs.length === 0}
      tail={!!(onclose || head)}
      two={!!subtitle}
      start={icon ? lead : undefined}
      end={onclose || head ? headEnd : undefined}
    >
      {#if subtitle}
        <span class="name">
          <Stack gap="2xs">
            {@render nameOf()}
            <Text role="caption" muted>{subtitle}</Text>
          </Stack>
        </span>
      {:else if editable}
        {@render nameOf()}
      {/if}
    </Toolbar>
    {#if tabs.length > 0}
      <Toolbar rule><Tabs {tabs} {current} onselect={select} /></Toolbar>
    {/if}
  {/snippet}
  <Stack gap={0}>{@render children()}</Stack>
</Panel>

<style lang="scss">
  @use '../styles/kata' as *;

  // The name takes the rest of the head, so that a long name ends with an ellipsis
  .name {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
