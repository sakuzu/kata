<script lang="ts">
  import Keyboard from '@lucide/svelte/icons/keyboard';
  import MousePointer from '@lucide/svelte/icons/mouse-pointer';
  import PanelLeft from '@lucide/svelte/icons/panel-left';
  import PanelRight from '@lucide/svelte/icons/panel-right';
  import Square from '@lucide/svelte/icons/square';
  import {
    Block,
    Button,
    Drawbar,
    type DrawbarTool,
    Field,
    Icon,
    Kebab,
    Panel,
    Row,
    SectionHeader,
    type SheetStage,
    Shell,
    type ShellLayout,
    type Shortcut,
    Stack,
    Text,
    TextInput,
    Toolbar,
    Topbar,
    Tree,
    TreeRow,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let leftOpen = $state(true);
  let rightOpen = $state(true);
  let shortcutsOpen = $state(false);
  let dockHeight = $state<number>();
  let layout = $state<ShellLayout>();
  // What the panels are in each mode, as a sentence
  const PANELS: Record<ShellLayout['leftMode'], string> = {
    beside: 'The panels stand beside the stage.',
    floating: 'The panels float over the stage.',
    sheet: 'The panels are sheets.',
  };
  let tool = $state('select');
  let name = $state('Hill');
  let selected = $state('hill');

  const tools: DrawbarTool[] = [
    { id: 'select', label: 'Select', icon: MousePointer, kbd: 'V', group: 'pick' },
    { id: 'line', label: 'Line', icon: 'polyline', kbd: 'L', group: 'draw' },
    { id: 'shape', label: 'Shape', icon: Square, kbd: 'S', group: 'draw' },
    { id: 'note', label: 'Note', icon: 'sticky-note', kbd: 'N', group: 'text' },
  ];
  const shortcuts: Shortcut[] = [
    ...tools.map((t) => ({
      key: t.kbd?.toLowerCase() ?? '',
      label: t.label,
      group: 'Tools',
      run: () => {
        tool = t.id;
      },
    })),
    {
      key: 'shift+l',
      label: 'Show the contents',
      group: 'Panels',
      run: () => (leftOpen = !leftOpen),
    },
    {
      key: 'shift+r',
      label: 'Show the details',
      group: 'Panels',
      run: () => (rightOpen = !rightOpen),
    },
    { key: 'mod+z', label: 'Undo', group: 'Edit', run: () => {} },
    { key: 'shift+mod+z', label: 'Redo', group: 'Edit', run: () => {} },
  ];

  let loading = $state(true);
  let besideLeft = $state(true);
  let besideRight = $state(true);
  let besideLayout = $state<ShellLayout>();
  let narrowLeft = $state(true);
  let restLeft = $state(false);
  let restRight = $state(false);
  let restStage = $state<SheetStage>('half');
  let showDock = $state(true);
  let restDock = $state(true);
</script>

{#snippet bar()}
  <Topbar brand="Sketchbook">
    {#snippet end({ compact }: { compact: boolean })}
      {#if compact}
        <Kebab
          items={[
            { id: 'contents', label: 'Contents', checked: leftOpen },
            { id: 'details', label: 'Details', checked: rightOpen },
            { id: 'shortcuts', label: 'Keyboard shortcuts' },
          ]}
          onselect={(id) => {
            if (id === 'contents') leftOpen = !leftOpen;
            else if (id === 'details') rightOpen = !rightOpen;
            else shortcutsOpen = true;
          }}
        />
      {:else}
        <Button
          variant="ghost"
          icon
          aria-label="Contents"
          aria-pressed={leftOpen}
          onclick={() => (leftOpen = !leftOpen)}
        >
          <Icon name={PanelLeft} />
        </Button>
        <Button
          variant="ghost"
          icon
          aria-label="Details"
          aria-pressed={rightOpen}
          onclick={() => (rightOpen = !rightOpen)}
        >
          <Icon name={PanelRight} />
        </Button>
        <Button
          variant="ghost"
          icon
          aria-label="Keyboard shortcuts"
          onclick={() => (shortcutsOpen = true)}
        >
          <Icon name={Keyboard} />
        </Button>
      {/if}
    {/snippet}
  </Topbar>
{/snippet}

{#snippet plainBar()}<Topbar brand="Sketchbook" />{/snippet}

{#snippet contents()}
  <Panel label="Contents">
    {#snippet head()}<Toolbar title="Contents" rule />{/snippet}
    <Tree label="Contents">
      <TreeRow expandable expanded>Background</TreeRow>
      <TreeRow depth={1} sel={selected === 'sky'} onclick={() => (selected = 'sky')}>Sky</TreeRow>
      <TreeRow depth={1} sel={selected === 'hill'} onclick={() => (selected = 'hill')}>Hill</TreeRow>
      <TreeRow>Figures</TreeRow>
      <TreeRow>Notes</TreeRow>
    </Tree>
  </Panel>
{/snippet}

{#snippet details()}
  <Panel label="Details">
    {#snippet head()}<Toolbar title="Details" rule />{/snippet}
    <Stack gap={0}>
      <SectionHeader label="Shape">
        <Field label="Name" for="shell-name">
          <TextInput id="shell-name" bind:value={name} />
        </Field>
      </SectionHeader>
      <Block>
        <Text muted>The width is {layout?.width ?? 'wide'}. {PANELS[layout?.leftMode ?? 'floating']}</Text>
      </Block>
    </Stack>
  </Panel>
{/snippet}

{#snippet properties()}
  <Panel label="Properties">
    {#snippet head()}<Toolbar title="Properties" rule />{/snippet}
    <Block>
      <Text muted>{PANELS[besideLayout?.leftMode ?? 'beside']}</Text>
    </Block>
  </Panel>
{/snippet}

{#snippet selection()}
  <Panel label="Selection">
    {#snippet head()}<Toolbar title="Selection" rule />{/snippet}
    <Block><Text muted>Nothing is selected.</Text></Block>
  </Panel>
{/snippet}

{#snippet surface()}<div class="grid" aria-label="Drawing" role="img"></div>{/snippet}

{#snippet loadingNote()}<Text muted>Loading the drawing</Text>{/snippet}

{#snippet toolbar()}
  <Drawbar label="Tools" {tools} current={tool} onselect={(id) => (tool = id)} />
{/snippet}

{#snippet columnToolbar({ column }: { column: boolean })}
  <Drawbar label="Tools" {tools} current={tool} onselect={(id) => (tool = id)} {column} />
{/snippet}

{#snippet outputSheet()}
  <Panel side="fill" label="Output">
    {#snippet head()}<Toolbar title="Output" rule />{/snippet}
    <Block><Text>Drag the handle, or below its lowest height to close the sheet.</Text></Block>
  </Panel>
{/snippet}

{#snippet output()}
  <Panel side="fill" label="Output">
    {#snippet head()}<Toolbar title="Output" rule />{/snippet}
    <Block><Text>Drag the top edge of the dock, or focus it and press the arrow keys.</Text></Block>
  </Panel>
{/snippet}

<Example>
  <Case label="Every region: the bar, both panels floating over the stage, the toolbar and the dock">
    <div class="frame">
      <Shell
        bind:leftOpen
        bind:rightOpen
        bind:shortcutsOpen
        bind:dockHeight
        {shortcuts}
        leftLabel="Contents"
        rightLabel="Details"
        onlayout={(l) => (layout = l)}
        onescape={() => (selected = '')}
        top={bar}
        left={contents}
        right={details}
        stage={surface}
        bottom={toolbar}
        dock={output}
      />
    </div>
  </Case>
  <Case label="With side set to beside: the panels stand beside the stage from 64rem">
    <div class="frame">
      <Shell
        side="beside"
        bind:leftOpen={besideLeft}
        bind:rightOpen={besideRight}
        leftLabel="Contents"
        rightLabel="Properties"
        onlayout={(l) => (besideLayout = l)}
        left={contents}
        right={properties}
        stage={surface}
        bottom={toolbar}
      />
    </div>
  </Case>
  <Case label="Only the stage and the toolbar, with a veil while the drawing loads">
    <div class="frame short">
      <Shell stage={surface} bottom={toolbar} veil={loading ? loadingNote : undefined} />
    </div>
    <Row>
      <Button onclick={() => (loading = !loading)}>{loading ? 'Finish loading' : 'Load again'}</Button>
    </Row>
  </Case>
  <Case label="narrow: a shell in the narrow form at any width">
    <div class="frame">
      <Shell
        narrow
        bind:leftOpen={narrowLeft}
        leftLabel="Contents"
        top={plainBar}
        left={contents}
        stage={surface}
        bottom={toolbar}
      />
    </div>
  </Case>
  <Case label="A left sheet that does not close (leftSheet) and the controls that open a closed side again (leftReopen, rightReopen)">
    <div class="frame">
      <Shell
        bind:leftOpen={restLeft}
        bind:rightOpen={restRight}
        bind:leftStage={restStage}
        leftSheet={{ stages: ['peek', 'half', 'full'], closable: false }}
        leftReopen={{ icon: PanelLeft, label: 'Show the contents' }}
        rightReopen={{ icon: PanelRight, label: 'Show the selection' }}
        leftLabel="Contents"
        rightLabel="Selection"
        top={plainBar}
        left={contents}
        right={selection}
        stage={surface}
        bottom={toolbar}
      />
    </div>
  </Case>
  <Case label="bottomFab: on a narrow screen the toolbar shows in one column (a column Drawbar) while the Fab is pressed">
    <div class="frame">
      <Shell
        narrow
        leftOpen={false}
        leftSheet={{ closable: false }}
        bottomFab={{ label: 'Tools', closeLabel: 'Hide the tools' }}
        leftLabel="Contents"
        top={plainBar}
        left={contents}
        stage={surface}
        bottom={columnToolbar}
      />
    </div>
  </Case>
  <Case label="bottomFab in a low frame: the column does not fit, scrolls and shows its scrollbar beside the tools">
    <div class="frame short">
      <Shell
        narrow
        leftOpen={false}
        bottomFab={{ label: 'Tools', closeLabel: 'Hide the tools' }}
        top={plainBar}
        stage={surface}
        bottom={columnToolbar}
      />
    </div>
  </Case>
  <Case label="dockSheet: on a narrow screen the dock is a sheet, which the application removes when it closes">
    <div class="frame">
      <Shell
        narrow
        leftOpen={false}
        dockSheet={{ label: 'Output' }}
        ondockclose={() => (showDock = false)}
        top={plainBar}
        stage={surface}
        bottom={toolbar}
        dock={showDock ? outputSheet : undefined}
      />
    </div>
    <Row>
      <Button disabled={showDock} onclick={() => (showDock = true)}>Show the output</Button>
    </Row>
  </Case>
  <Case label="A sheet that does not close and the dock's sheet: the resting sheet is not shown while the dock is open">
    <div class="frame">
      <Shell
        narrow
        leftOpen={false}
        leftSheet={{ closable: false }}
        dockSheet={{ label: 'Output' }}
        ondockclose={() => (restDock = false)}
        leftLabel="Contents"
        top={plainBar}
        left={contents}
        stage={surface}
        bottom={toolbar}
        dock={restDock ? outputSheet : undefined}
      />
    </div>
    <Row>
      <Button disabled={restDock} onclick={() => (restDock = true)}>Show the output</Button>
    </Row>
  </Case>
  <Case label="topFloating: on a narrow screen the bar floats over the stage, which fills the shell">
    <div class="frame">
      <Shell
        narrow
        topFloating
        leftOpen={false}
        leftSheet={{ closable: false }}
        leftLabel="Contents"
        top={plainBar}
        left={contents}
        stage={surface}
        bottom={toolbar}
      />
    </div>
  </Case>
  <Case label="The bar floating over the stage and the toolbar in a Fab">
    <div class="frame">
      <Shell
        narrow
        topFloating
        leftOpen={false}
        leftSheet={{ closable: false }}
        bottomFab={{ label: 'Tools', closeLabel: 'Hide the tools' }}
        leftLabel="Contents"
        top={plainBar}
        left={contents}
        stage={surface}
        bottom={columnToolbar}
      />
    </div>
  </Case>
</Example>

<style>
  /* The shell fills its frame, as it fills the window of an application */
  .frame {
    position: relative;
    height: 36rem;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  .frame.short {
    height: 16rem;
  }
  /* A plain drawing surface with a grid */
  .grid {
    width: 100%;
    height: 100%;
    background-color: var(--kata-color-ground);
    background-image:
      linear-gradient(var(--kata-color-line) var(--kata-border-width), transparent 0),
      linear-gradient(90deg, var(--kata-color-line) var(--kata-border-width), transparent 0);
    background-size: var(--kata-gap-xl) var(--kata-gap-xl);
    background-position: center;
  }
</style>
