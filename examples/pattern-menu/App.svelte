<script lang="ts">
  import {
    Button,
    Dropdown,
    Kebab,
    List,
    ListItem,
    MenuList,
    type MenuModel,
    Row,
    Text,
    Topbar,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import { appMenu } from '../_shared/menu.js';
  import Surface from '../_shared/Surface.svelte';

  let chosen = $state('');
  const pick = (id: string) => (chosen = id);

  // One model per menu; the same shape serves a button, a bar and the actions of an item
  const arrange: MenuModel[] = [
    { heading: 'Order' },
    { id: 'front', label: 'Bring to front', kbd: '⇧⌘]' },
    { id: 'back', label: 'Send to back', kbd: '⇧⌘[' },
    { divider: true },
    {
      id: 'align',
      label: 'Align',
      items: [
        { id: 'align-left', label: 'Left' },
        { id: 'align-center', label: 'Centre' },
        { id: 'align-right', label: 'Right' },
      ],
    },
  ];
  const itemActions: MenuModel[] = [
    { id: 'rename', label: 'Rename', icon: 'pencil' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { divider: true },
    { id: 'delete', label: 'Delete…', icon: 'trash-2', danger: true },
  ];
  const docs = ['Quarterly plan', 'Floor sketch', 'Team notes'];
</script>

<Example>
  <Case label="A button that opens a menu: a heading, key hints, a divider and a submenu">
    <Row>
      <Dropdown menu align="start" role="box">
        {#snippet trigger(toggle, open)}
          <Button trailing="chevron-down" aria-haspopup="menu" aria-expanded={open} onclick={toggle}>
            Arrange
          </Button>
        {/snippet}
        {#snippet panel(close)}
          <MenuList items={arrange} onselect={pick} onclose={close} />
        {/snippet}
      </Dropdown>
    </Row>
  </Case>
  <Case label="The actions of an item: a Kebab at the end of each row">
    <Surface width="22.5rem">
      <List label="Documents">
        {#each docs as doc (doc)}
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>{doc}</Text>
            <Kebab items={itemActions} onselect={(id) => pick(`${id} ${doc}`)} />
          </ListItem>
        {/each}
      </List>
    </Surface>
  </Case>
  <Case label="The menu of the application, behind its name in the top bar">
    <Topbar brand="Sketchbook" brandLabel="Sketchbook menu" menu={appMenu} onmenu={pick} />
  </Case>
  <Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text>
</Example>
