<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import Folder from '@lucide/svelte/icons/folder';
  import { Avatar, Badge, Icon, List, ListItem, Thumbnail } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let picked = $state('b');
  const docs = [
    { id: 'a', name: 'Quarterly report' },
    { id: 'b', name: 'Site survey' },
    { id: 'c', name: 'Budget draft' },
  ];
</script>

<Example>
  <Case label="Items that are pressed, one selected (press to select)">
    <Surface width="22.5rem">
      <List label="Documents">
        {#each docs as d (d.id)}
          <ListItem
            columns="auto minmax(0, 1fr)"
            sel={picked === d.id}
            aria-current={picked === d.id ? 'true' : undefined}
            onclick={() => (picked = d.id)}
          >
            <Icon name={FileText} />
            <span>{d.name}</span>
          </ListItem>
        {/each}
      </List>
    </Surface>
  </Case>
  <Case label="rows mark: items with and without a mark line up">
    <Surface width="22.5rem">
      <List label="People" rows="mark">
        <ListItem columns="auto minmax(0, 1fr) auto" plain rule>
          <Avatar initial="SL" in />
          <span>Sam Lee</span>
          <Badge tone="blue">Can edit</Badge>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" plain rule>
          <Icon name={Folder} />
          <span>A folder, as tall as its neighbours</span>
        </ListItem>
      </List>
    </Surface>
  </Case>
  <Case label="rows thumb">
    <Surface width="22.5rem">
      <List label="Pictures" rows="thumb">
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Thumbnail size="2rem" />
          <span>Cover</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Icon name={FileText} />
          <span>Notes</span>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
