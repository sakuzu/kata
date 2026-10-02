<script lang="ts">
  import {
    Button,
    ColorGrid,
    Footer,
    Icon,
    Row,
    SectionHeader,
    SelectionSummary,
    Slider,
    Stack,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let color = $state('#2F6FDE');
  let opacity = $state(80);
</script>

<Example>
  <Case label="Five things of two kinds: the counts, the shared fields and the actions">
    <div class="frame">
      <SelectionSummary
        count={5}
        kinds={[
          { label: 'Shapes', count: 3 },
          { label: 'Notes', count: 2 },
        ]}
        onclose={() => {}}
      >
        {#snippet end()}
          <Button variant="ghost" icon aria-label="Delete" tone="danger"><Icon name="trash-2" /></Button>
        {/snippet}
        {#snippet fields()}
          <SectionHeader label="Fill">
            <ColorGrid
              colors={[
                { hex: '#2F6FDE', name: 'Blue' },
                { hex: '#1F9D55', name: 'Green' },
                { hex: '#D9822B', name: 'Orange' },
                { hex: '#C2393F', name: 'Red' },
                { hex: '#7A4FD0', name: 'Purple' },
              ]}
              columns={5}
              value={color}
              onselect={(c) => (color = c)}
              label="Fill"
            />
          </SectionHeader>
          <SectionHeader label="Opacity">
            <Slider
              value={opacity}
              ariaLabel="Opacity"
              display={`${opacity}%`}
              oninput={(v) => (opacity = v)}
            />
          </SectionHeader>
        {/snippet}
        {#snippet actions()}
          <Stack gap="sm">
            <Row wrap>
              <Button>Group</Button>
              <Button>Duplicate</Button>
            </Row>
            <Text role="caption" muted>Grouping keeps the order of the selection.</Text>
          </Stack>
        {/snippet}
      </SelectionSummary>
    </div>
  </Case>
  <Case label="foot: a Footer with Delete in the lead">
    <div class="frame foot">
      <SelectionSummary
        count={3}
        kinds={[{ label: 'Shapes', count: 3 }]}
        onclose={() => {}}
      >
        {#snippet foot()}
          <Footer>
            {#snippet lead()}<Button variant="danger">Delete</Button>{/snippet}
          </Footer>
        {/snippet}
      </SelectionSummary>
    </div>
  </Case>
  <Case label="The frame alone: the counts only">
    <div class="frame short">
      <SelectionSummary count={2} kinds={[{ label: 'Shapes', count: 2 }]} />
    </div>
  </Case>
</Example>

<style>
  .frame {
    display: flex;
    height: 34rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 10rem;
  }
  .frame.foot {
    height: 16rem;
  }
</style>
