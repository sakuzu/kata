<script lang="ts">
  import { Button, Dropdown, Menu, MenuList, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';
  import { appMenu } from '../_shared/menu.js';

  let chosen = $state('');
  const pick = (id: string) => (chosen = id);
</script>

<Example>
  <Case label="A model with submenus, a divider, a heading and check marks, in a Menu">
    <Frame>
      <Menu>
        <div role="menu"><MenuList items={appMenu} onselect={pick} /></div>
      </Menu>
    </Frame>
  </Case>
  <Case label="inline: a submenu takes the place of the list, under a row that goes back">
    <Frame>
      <Menu>
        <div role="menu"><MenuList items={appMenu} onselect={pick} inline /></div>
      </Menu>
    </Frame>
  </Case>
  <Case label="In a Dropdown with menu: the arrow keys move into and out of the submenus">
    <Row gap="sm" wrap>
      <Dropdown menu align="start" role="box">
        {#snippet trigger(toggle, open)}
          <Button trailing="chevron-down" aria-haspopup="menu" aria-expanded={open} onclick={toggle}
            >Edit</Button
          >
        {/snippet}
        {#snippet panel(close)}
          <MenuList items={appMenu} onselect={pick} onclose={close} />
        {/snippet}
      </Dropdown>
    </Row>
    <Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text>
  </Case>
</Example>
