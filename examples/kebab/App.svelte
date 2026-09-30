<script lang="ts">
  import {
    Kebab,
    type KebabAction,
    List,
    ListItem,
    type MenuModel,
    Row,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let chosen = $state<KebabAction | ''>('');
  let picked = $state('');
  const menu: MenuModel[] = [
    { id: 'rename', label: 'Rename' },
    { id: 'arrange', label: 'Arrange', items: [{ id: 'front', label: 'Bring to front' }] },
    { divider: true },
    { id: 'remove', label: 'Remove…', danger: true },
  ];
</script>

<Example>
  <Case label="The default actions, and a chosen few (the order stays fixed)">
    <Surface width="22.5rem">
      <Small>
        <List>
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>Quarterly plan</Text>
            <Kebab onaction={(a) => (chosen = a)} />
          </ListItem>
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>Team notes</Text>
            <Kebab actions={['delete', 'copy', 'publish']} onaction={(a) => (chosen = a)} />
          </ListItem>
        </List>
      </Small>
    </Surface>
    <Row><Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text></Row>
  </Case>
  <Case label="items: a menu drawn from a model, with a submenu">
    <Surface width="22.5rem">
      <Small>
        <List>
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>Site survey</Text>
            <Kebab items={menu} onselect={(id) => (picked = id)} />
          </ListItem>
        </List>
      </Small>
    </Surface>
    <Row><Text role="caption" muted>Chosen: {picked || 'nothing yet'}</Text></Row>
  </Case>
</Example>
