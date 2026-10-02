<script lang="ts">
  import {
    Block,
    Button,
    FieldList,
    Footer,
    InspectorFrame,
    InspectorSection,
    Sheet,
    Stack,
    Text,
    Toolbar,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let stage = $state<'peek' | 'half' | 'full'>('half');
  let two = $state<'peek' | 'half' | 'full'>('full');
  let low = $state<'peek' | 'half' | 'full'>('peek');
  let shown = $state(true);
  let inspector = $state<'peek' | 'half' | 'full'>('half');
  // Eight sections, taller than half the frame
  const sections = Array.from({ length: 8 }, (_, i) => `Section ${i + 1}`);
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
  <Case label="pane: an InspectorFrame taller than half, in a wrapper as tall as its place; at half its content scrolls above the foot">
    <div class="frame tall">
      <Sheet bind:stage={inspector} pane label="Inspector">
        <div class="seat">
          <InspectorFrame title="Front entrance" titleEditable={false} subtitle="Shape" side="fill">
            {#each sections as title (title)}
              <InspectorSection {title}>
                <FieldList
                  fields={[
                    { key: 'width', kind: 'number', label: 'Width', value: 2, unit: 'px', min: 0 },
                    { key: 'shadow', kind: 'toggle', label: 'Shadow', value: false },
                  ]}
                />
              </InspectorSection>
            {/each}
            {#snippet end()}
              <Footer>{#snippet primary()}<Button>Delete</Button>{/snippet}</Footer>
            {/snippet}
          </InspectorFrame>
        </div>
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
  /* As tall as a phone's frame under its bar */
  .frame.tall {
    height: 37.5rem;
  }
  /* An application's wrapper between the sheet and the panel, as tall as its place */
  .seat {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  .seat > :global(*) {
    flex: 1 1 auto;
    min-height: 0;
  }
  /* The inline sheet at the bottom of its place */
  .flow {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 8rem;
  }
</style>
