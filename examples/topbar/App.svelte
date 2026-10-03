<script lang="ts">
  import Bell from '@lucide/svelte/icons/bell';
  import Menu from '@lucide/svelte/icons/menu';
  import {
    Button,
    Icon,
    InlineEdit,
    Kebab,
    MenuDivider,
    MenuItem,
    Popover,
    Presence,
    SearchInput,
    Topbar,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import { appMenu } from '../_shared/menu.js';

  let name = $state('Spring layout');
  let query = $state('');
  const people = [
    { name: 'Sam Taylor', you: true },
    { name: 'Kai Morgan', color: '#6f86e6' },
    { name: 'Ana Ruiz', color: '#d9a441' },
  ];
</script>

<Example>
  <Case label="The brand as a link, and actions at the end">
    <Topbar brand="Sketchbook" brandHref="#top">
      {#snippet end()}
        <Button variant="ghost" icon aria-label="Notifications"><Icon name={Bell} /></Button>
        <Button variant="ghost" icon aria-label="Search"><Icon name="search" /></Button>
      {/snippet}
    </Topbar>
  </Case>
  <Case label="A button before the brand, the crumbs, a title in the centre, presence and actions">
    <Topbar
      brand="Sketchbook"
      crumbs={[
        { label: 'Team', href: '#top' },
        { label: 'Drafts', href: '#top' },
      ]}
      crumbsLabel="Location"
    >
      {#snippet lead()}
        <Button variant="ghost" icon aria-label="Open the menu"><Icon name={Menu} /></Button>
      {/snippet}
      {#snippet center()}
        <InlineEdit
          title
          value={name}
          placeholder="Name the drawing"
          label="Name"
          onCommit={(v) => (name = v)}
        />
      {/snippet}
      {#snippet presence({ compact }: { compact: boolean })}
        <Presence users={people} max={compact ? 0 : 3} />
      {/snippet}
      {#snippet end({ compact }: { compact: boolean })}
        {#if compact}
          <Kebab items={[{ id: 'share', label: 'Share' }]} onselect={() => {}} />
        {:else}
          <Button variant="primary">Share</Button>
        {/if}
      {/snippet}
    </Topbar>
  </Case>
  <Case label="A search in the centre, folded into an icon button when the row is short">
    <Topbar brand="Sketchbook" brandHref="#top">
      {#snippet center({ compact }: { compact: boolean })}
        {#if compact}
          <Popover align="end">
            {#snippet anchor(toggle, open)}
              <Button
                variant="ghost"
                icon
                aria-label="Search"
                aria-haspopup="true"
                aria-expanded={open}
                onclick={toggle}><Icon name="search" /></Button
              >
            {/snippet}
            <SearchInput bind:value={query} label="Search" placeholder="Search the help" />
          </Popover>
        {:else}
          <SearchInput bind:value={query} label="Search" placeholder="Search the help" />
        {/if}
      {/snippet}
      {#snippet end({ compact }: { compact: boolean })}
        {#if compact}
          <Kebab items={[{ id: 'sign-in', label: 'Sign in' }]} onselect={() => {}} />
        {:else}
          <Button>Sign in</Button>
        {/if}
      {/snippet}
    </Topbar>
  </Case>
  <Case label="The brand opens the application's menu (brandMenu)">
    <Topbar brand="Sketchbook" brandLabel="Menu of Sketchbook">
      {#snippet brandMenu(close)}
        <MenuItem onclick={close}>New drawing</MenuItem>
        <MenuItem kbd="⌘O" onclick={close}>Open…</MenuItem>
        <MenuDivider />
        <MenuItem onclick={close}>Settings</MenuItem>
      {/snippet}
      {#snippet end()}<Button>Share</Button>{/snippet}
    </Topbar>
  </Case>
  <Case label="The brand opens a menu drawn from a model (menu)">
    <Topbar brand="Sketchbook" brandLabel="Menu of Sketchbook" menu={appMenu} onmenu={() => {}}>
      {#snippet end()}<Button>Share</Button>{/snippet}
    </Topbar>
  </Case>
  <Case label="A longer trail: when the row is short the crumbs show only the current place, and then none">
    <Topbar
      brand="Sketchbook"
      brandHref="#top"
      crumbs={[
        { label: 'Field survey team', href: '#top' },
        { label: 'Drafts', href: '#top' },
        { label: 'Spring layout' },
      ]}
      crumbsLabel="Location"
    >
      {#snippet end({ compact }: { compact: boolean })}
        {#if compact}
          <Kebab items={[{ id: 'share', label: 'Share' }]} onselect={() => {}} />
        {:else}
          <Button>Share</Button>
        {/if}
      {/snippet}
    </Topbar>
  </Case>
  <Case label="No brand: the crumbs start the bar">
    <Topbar crumbs={[{ label: 'Team', href: '#top' }, { label: 'Settings' }]} crumbsLabel="Location">
      {#snippet end()}<Button>Done</Button>{/snippet}
    </Topbar>
  </Case>
</Example>
