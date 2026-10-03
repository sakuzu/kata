<script lang="ts">
  import {
    Block,
    Button,
    Footer,
    Icon,
    Panel,
    Row,
    SectionHeader,
    Stack,
    Text,
    Toolbar,
    Tree,
    TreeRow,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let dock = $state(160);
</script>

<Example>
  <Case label="A panel: a toolbar, the content that scrolls, a footer">
    <div class="frame">
      <div class="side">
        <Panel side="panel" label="Contents">
          {#snippet head()}
            <Toolbar title="Contents" rule tail>
              {#snippet end()}
                <Button variant="ghost" icon aria-label="Add"><Icon name="plus" /></Button>
              {/snippet}
            </Toolbar>
          {/snippet}
          <Stack gap={0}>
            <Tree label="Contents">
              <TreeRow expandable expanded>Background</TreeRow>
              <TreeRow depth={1}>Sky</TreeRow>
              <TreeRow depth={1} sel>Hills</TreeRow>
              <TreeRow>Figures</TreeRow>
              <TreeRow>Notes</TreeRow>
            </Tree>
            <SectionHeader label="Details">
              <Text>Text and fields go in a group or a block, which brings the padding.</Text>
            </SectionHeader>
            <Block>
              <Text>The content scrolls when it is taller than the panel.</Text>
            </Block>
          </Stack>
          {#snippet foot()}
            <Footer>
              {#snippet cancel()}<Button>Cancel</Button>{/snippet}
              {#snippet primary()}<Button variant="primary">Apply</Button>{/snippet}
            </Footer>
          {/snippet}
        </Panel>
      </div>
    </div>
  </Case>
  <Case label="rail: the narrow side column, without a head">
    <div class="frame short">
      <div class="side">
        <Panel side="rail" label="Places">
          <Tree label="Places" flat>
            <TreeRow grip={false} sel onclick={() => {}}>Home</TreeRow>
            <TreeRow grip={false} onclick={() => {}}>Drafts</TreeRow>
            <TreeRow grip={false} onclick={() => {}}>Shared with me</TreeRow>
          </Tree>
        </Panel>
      </div>
    </div>
  </Case>
  <Case label="fit: the height of the content only">
    <div class="frame short">
      <div class="side">
        <Panel side="panel" fit>
          {#snippet head()}<Toolbar title="Selection" rule />{/snippet}
          <Block><Text>Two shapes are selected.</Text></Block>
        </Panel>
      </div>
    </div>
  </Case>
  <Case label="fill with resizable: a dock whose height the grip changes">
    <div class="frame dock">
      <div class="seat" style:height="{dock}px">
        <Panel
          side="fill"
          resizable
          resizeLabel="Height of the dock"
          onresize={(h) => (dock = Math.max(96, Math.min(240, Math.round(h))))}
        >
          {#snippet head()}<Toolbar title="Output" rule />{/snippet}
          <Block>
            <Row><Text>Drag the top edge, or focus it and press the arrow keys.</Text></Row>
          </Block>
        </Panel>
      </div>
    </div>
  </Case>
</Example>

<style>
  .frame {
    display: flex;
    height: 26rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 12rem;
  }
  .frame.dock {
    height: 16rem;
    flex-direction: column;
    justify-content: flex-end;
  }
  .seat {
    display: flex;
    flex: none;
    border-top: var(--kata-border-width) solid var(--kata-color-line-strong);
  }
  /* The side the panel docks into draws the line between it and the ground, as Shell's side does */
  .side {
    display: flex;
    flex: none;
    min-height: 0;
    max-width: 100%;
    border-right: var(--kata-border-width) solid var(--kata-color-line-strong);
  }
</style>
