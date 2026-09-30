<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Crumbs from './Crumbs.svelte';
  import Page from './Page.svelte';
  import PageHeader from './PageHeader.svelte';
  import Stack from './Stack.svelte';
  import Tabs from './Tabs.svelte';

  // SettingsPage: the frame of a settings page. A Page of the settings width, with a PageHeader as
  // its head (the crumbs, then the title), then the tabs and the sections. From the title to the
  // tabs is pad-lg (the Page's distance to its content); from the tabs' line to the first section
  // is gap-lg. The sections are stacked with gap 0; each section brings its own distance and line.
  // Below 48rem the margin at the sides is gap-md.
  //
  //   <SettingsPage title="General" crumbs={[{ label: 'Team', href: '/' }]}
  //     tabs={[{ id: 'general', label: 'General', href: '/settings' }]} current="general">
  //     <Section title="Profile">…</Section>
  //   </SettingsPage>
  let {
    title,
    crumbs = [],
    crumbsLabel,
    tabs,
    current,
    tabsLabel,
    onselect,
    titleEnd,
    children,
  }: {
    /** The title of the page */
    title: string;
    /** The trail to the page, above the title */
    crumbs?: { label: string; href?: string; onclick?: () => void }[];
    /** The name of the trail */
    crumbsLabel?: string;
    /** The tabs of the settings, each a link to its page or a view of this one */
    tabs?: { id: string; label: string; href?: string }[];
    /** The id of the current tab */
    current?: string;
    /** The name of the set of tabs */
    tabsLabel?: string;
    /** Called with the id of the tab that is opened */
    onselect?: (id: string) => void;
    /** A borderless icon button on the right of the title (rename) */
    titleEnd?: Snippet;
    /** The sections */
    children: Snippet;
  } = $props();
  const withTabs = $derived(!!tabs?.length && current !== undefined);
</script>

{#snippet trail()}<Crumbs items={crumbs} label={crumbsLabel} />{/snippet}

<Page width="settings" flush={withTabs}>
  {#snippet head()}
    <PageHeader {title} crumbs={crumbs.length ? trail : undefined} {titleEnd} />
  {/snippet}
  {#if withTabs && tabs && current !== undefined}
    <div class="tabs"><Tabs {tabs} {current} label={tabsLabel} {onselect} /></div>
  {/if}
  <Stack gap={0}>{@render children()}</Stack>
</Page>

<style lang="scss">
  @use '../styles/kata' as *;

  // The tabs keep their own width inside the column
  .tabs {
    min-width: 0;
  }
</style>
