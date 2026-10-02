<script lang="ts">
  import { Block, Button, Footer, Sheet, Stack, Text, Toolbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let stage = $state<'peek' | 'half' | 'full'>('half');
  let two = $state<'peek' | 'half' | 'full'>('full');
  let low = $state<'peek' | 'half' | 'full'>('peek');
  let shown = $state(true);
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
          <Footer>{#snippet primary()}<Button variant="primary">Share</Button>{/snippet}</Footer>
        {/snippet}
      </Sheet>
    </div>
  </Case>
  <Case label="closable: a drag below peek, or ArrowDown on the handle at peek, closes it">
    <div class="frame">
      {#if shown}
        <Sheet
          bind:stage={low}
          stages={['peek', 'half']}
          closable
          onclose={() => (shown = false)}
          label="Filters"
          {head}
        >
          {@render body()}
        </Sheet>
      {:else}
        <Block>
          <Button onclick={() => ((low = 'peek'), (shown = true))}>Show the sheet</Button>
        </Block>
      {/if}
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
