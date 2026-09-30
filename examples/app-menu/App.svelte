<script lang="ts">
  import { AppMenu, Row, Text, Topbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import { appMenu } from '../_shared/menu.js';

  let chosen = $state('');
  const pick = (id: string) => (chosen = id);
</script>

<Example>
  <Case label="One button with the menu of the application; a submenu opens next to its row">
    <Row gap="sm" wrap>
      <AppMenu items={appMenu} onselect={pick} />
      <AppMenu items={appMenu} onselect={pick} icon="ellipsis" label="More" />
    </Row>
    <Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text>
  </Case>
  <Case label="The same model as the menu of the brand of a Topbar">
    <Topbar brand="Sketchbook" brandLabel="Sketchbook menu" menu={appMenu} onmenu={pick} />
  </Case>
</Example>
