<script lang="ts">
  import Bell from '@lucide/svelte/icons/bell';
  import Menu from '@lucide/svelte/icons/menu';
  import { Button, Icon, InlineEdit, Text, Topbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let name = $state('Spring layout');
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
      {#snippet presence()}<Text role="caption">Sam and Kai are here</Text>{/snippet}
      {#snippet end()}<Button variant="primary">Share</Button>{/snippet}
    </Topbar>
  </Case>
  <Case label="No brand: the crumbs start the bar">
    <Topbar crumbs={[{ label: 'Team', href: '#top' }, { label: 'Settings' }]} crumbsLabel="Location">
      {#snippet end()}<Button>Done</Button>{/snippet}
    </Topbar>
  </Case>
</Example>
