<script lang="ts">
  import { Block, Button, Sheet, Stack, Text, Toolbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let stage = $state<'peek' | 'half' | 'full'>('half');
  let two = $state<'peek' | 'half' | 'full'>('full');
</script>

{#snippet head()}
  <Toolbar title="Details" rule />
{/snippet}

{#snippet body()}
  <Block>
    <Stack gap="sm">
      <Text>Created on 12 March by the owner of the team.</Text>
      <Text role="caption" muted>Press the handle, or use the arrow keys on it, to change the height.</Text>
    </Stack>
  </Block>
{/snippet}

<Example>
  <Case label="Three heights: the handle steps through peek, half and full ({stage})">
    <div class="frame">
      <Sheet bind:stage label="Details" {head}>{@render body()}</Sheet>
    </div>
  </Case>
  <Case label="Two heights (half and full), with a foot for the primary action">
    <div class="frame">
      <Sheet bind:stage={two} stages={['half', 'full']} label="Share" {head}>
        {@render body()}
        {#snippet foot()}
          <Block><Button variant="primary" block>Share</Button></Block>
        {/snippet}
      </Sheet>
    </div>
  </Case>
  <Case label="In the flow (inline), at peek">
    <div class="flow">
      <Sheet inline stage="peek" label="Details (inline)" {head}>{@render body()}</Sheet>
    </div>
  </Case>
</Example>

<style>
  /* A positioned frame, as the frame of an application is */
  .frame {
    position: relative;
    height: 20rem;
    overflow: hidden;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  /* The inline sheet at the bottom of its place */
  .flow {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 8rem;
  }
</style>
