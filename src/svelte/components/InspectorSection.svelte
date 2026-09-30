<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import SectionHeader from './SectionHeader.svelte';

  // InspectorSection: a titled group of an inspector, a SectionHeader that can fold. The head is
  // the title and, on the right, the application's actions (end) and, with collapsible, a small
  // ghost button with a chevron that opens and closes the group. Closed, only the head remains.
  // The rows (InspectorRow, a FieldList) go straight in; sections are stacked with gap 0.
  //
  //   <InspectorSection title="Stroke" collapsible bind:open>
  //     <FieldList fields={stroke} onchange={apply} />
  //   </InspectorSection>
  let {
    title,
    collapsible = false,
    open = $bindable(true),
    ontoggle,
    end,
    rule = false,
    flush = false,
    children,
  }: {
    /** The name of the group */
    title: string;
    /** The group can be closed and opened */
    collapsible?: boolean;
    /** Whether the content shows (open by default) */
    open?: boolean;
    /** Called with the new state when the chevron is pressed */
    ontoggle?: (open: boolean) => void;
    /** Actions on the right of the head, small buttons (a snippet) */
    end?: Snippet;
    /** Draws a line above the group */
    rule?: boolean;
    /** The content reaches the edges (a list, a tree) */
    flush?: boolean;
    /** The rows */
    children: Snippet;
  } = $props();

  const shown = $derived(!collapsible || open);

  function toggle() {
    open = !open;
    ontoggle?.(open);
  }
</script>

{#snippet actions()}
  {@render end?.()}
  {#if collapsible}
    <Button
      variant="ghost"
      icon
      aria-label={open ? getMessages().collapse : getMessages().expand}
      aria-expanded={open}
      onclick={toggle}
    >
      <Icon name={open ? 'chevron-down' : 'chevron-right'} />
    </Button>
  {/if}
{/snippet}

<SectionHeader
  label={title}
  {rule}
  flush={flush || !shown}
  actions={end || collapsible ? actions : undefined}
>
  {#if shown}{@render children()}{/if}
</SectionHeader>
