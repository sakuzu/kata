<script lang="ts">
  import {
    Button,
    Footer,
    Icon,
    InspectorFrame,
    NumberInput,
    Pair,
    SectionHeader,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const tabs = [
    { id: 'style', label: 'Style' },
    { id: 'attributes', label: 'Attributes' },
  ];
  let name = $state('Front entrance');
  let tab = $state('style');
  let opacity = $state<number | null>(80);
</script>

<Example>
  <Case label="A name changed where it stands, two tabs, a control in the head and a close button">
    <div class="frame">
      <InspectorFrame
        title={name}
        ontitle={(next) => (name = next || name)}
        subtitle="Shape"
        {tabs}
        bind:current={tab}
        onclose={() => {}}
      >
        {#snippet head()}
          <Button variant="ghost" icon aria-label="Delete" tone="danger"><Icon name="trash-2" /></Button>
        {/snippet}
        {#if tab === 'style'}
          <SectionHeader label="Fill">
            <Pair label="Opacity">
              <NumberInput bind:value={opacity} unit="%" ariaLabel="Opacity" />
            </Pair>
          </SectionHeader>
        {:else}
          <SectionHeader label="Attributes">
            <Text muted>No attributes.</Text>
          </SectionHeader>
        {/if}
      </InspectorFrame>
    </div>
  </Case>
  <Case label="A name that cannot be changed, no tabs, a foot">
    <div class="frame short">
      <InspectorFrame title="Page 2" titleEditable={false} icon="image">
        <SectionHeader label="Size">
          <Text>1920 × 1080</Text>
        </SectionHeader>
        {#snippet end()}
          <Footer>
            {#snippet primary()}<Button variant="primary">Export</Button>{/snippet}
          </Footer>
        {/snippet}
      </InspectorFrame>
    </div>
  </Case>
</Example>

<style>
  .frame {
    display: flex;
    height: 30rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 16rem;
  }
</style>
