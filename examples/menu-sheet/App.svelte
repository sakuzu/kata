<script lang="ts">
  import { Button, MenuSheet, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import { appMenu } from '../_shared/menu.js';

  let open = $state(true);
  let chosen = $state('');
</script>

<Example>
  <Case label="The menu of the application in a sheet; a submenu takes the place of the list">
    <div class="frame">
      <div class="stage">
        <Button onclick={() => (open = true)}>Menu</Button>
        <Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text>
      </div>
      <MenuSheet bind:open items={appMenu} onselect={(id) => (chosen = id)} />
    </div>
  </Case>
</Example>

<style>
  /* A positioned frame, as the frame of an application is */
  .frame {
    position: relative;
    max-width: 24rem;
    height: 28rem;
    overflow: hidden;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  .stage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--kata-gap-sm);
    padding: var(--kata-gap-md);
  }
</style>
