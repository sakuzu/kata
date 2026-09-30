<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Section from './Section.svelte';

  // SettingsSection: one group of settings on a SettingsPage. It is a Section: the title (h2) with
  // an optional status on the right, gap-xs, the description, then the rows gap-lg below. The rows
  // are SettingsRow, gap-lg apart. Sections are stacked with gap 0 (the SettingsPage does it); each
  // one after the first draws a line above.
  //
  //   <SettingsSection title="General" description="How the document is named.">
  //     <SettingsRow label="Name" for="name"><TextInput id="name" bind:value={name} /></SettingsRow>
  //   </SettingsSection>
  let {
    title,
    description,
    status,
    children,
  }: {
    /** The title of the group (h2) */
    title: string;
    /** One sentence under the title that applies to every row */
    description?: string;
    /** A short status on the right of the title (saving, saved) */
    status?: string;
    /** The rows, SettingsRow */
    children: Snippet;
  } = $props();
</script>

<Section {title} note={description} {status} gap="lg">{@render children()}</Section>
