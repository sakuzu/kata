<script lang="ts">
  import {
    type AttributeItem,
    AttributeList,
    Block,
    Button,
    ColorGrid,
    FieldList,
    type FieldSpec,
    Footer,
    Icon,
    InspectorFrame,
    InspectorSection,
    Markbox,
    Swatch,
    Text,
    Tree,
    TreeRow,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  // One shape: its name, its style kept by key, and its attributes
  let name = $state('Front entrance');
  let tab = $state('style');
  let style = $state<Record<string, unknown>>({
    fill: '#2F6FDE',
    opacity: 80,
    width: 2,
    dash: 'solid',
    cap: 'round',
    shadow: false,
    label: '',
    symbol: 'point',
  });
  let attributes = $state<AttributeItem[]>([
    { key: 'id', value: 'a41f' },
    { key: 'Kind', value: 'Entrance' },
    { key: 'Capacity', value: '320' },
    { key: '_order', value: '7' },
  ]);
  const set = (key: string, value: unknown) => (style[key] = value);
  const spec = (key: string, rest: Omit<FieldSpec, 'key' | 'value'>): FieldSpec => ({
    key,
    value: style[key],
    ...rest,
  });

  const fill = $derived([
    spec('fill', { kind: 'color', label: 'Color' }),
    spec('opacity', { kind: 'slider', label: 'Opacity', unit: '%' }),
  ]);
  const stroke = $derived([
    spec('width', { kind: 'number', label: 'Width', unit: 'px', min: 0 }),
    spec('dash', {
      kind: 'select',
      label: 'Style',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ],
    }),
    spec('cap', {
      kind: 'segmented',
      label: 'Ends',
      options: [
        { value: 'butt', label: 'Flat' },
        { value: 'round', label: 'Round' },
      ],
    }),
    spec('shadow', { kind: 'toggle', label: 'Shadow' }),
  ]);
  const more = $derived([
    spec('label', { kind: 'text', label: 'Label', placeholder: 'None' }),
    spec('symbol', { kind: 'custom', label: 'Symbol' }),
  ]);

  // A group of three shapes
  let group = $state('Entrances');
  let visible = $state(true);
  let locked = $state(false);
  const members = [
    { id: 'm1', name: 'Front entrance', color: '#2F6FDE' },
    { id: 'm2', name: 'Side entrance', color: '#1F9D55' },
    { id: 'm3', name: 'Loading bay', color: '#D9822B' },
  ];
  // A band under the head: the colors of a note, picked at once
  const colors = [
    { name: 'Yellow', hex: '#F5D90A' },
    { name: 'Orange', hex: '#F76808' },
    { name: 'Pink', hex: '#E93D82' },
    { name: 'Blue', hex: '#0091FF' },
    { name: 'Green', hex: '#30A46C' },
  ];
  let note = $state('Check the door');
  let noteColor = $state('#F5D90A');
  let noteTab = $state('style');

  const display = $derived<FieldSpec[]>([
    { key: 'visible', kind: 'toggle', label: 'Visible', value: visible },
    { key: 'locked', kind: 'toggle', label: 'Locked', value: locked },
  ]);
</script>

<Example>
  <Case label="One thing: the name changed where it stands, the style and the attributes in two tabs">
    <div class="frame">
      <InspectorFrame
        title={name}
        ontitle={(next) => (name = next || name)}
        subtitle="Shape"
        tabs={[
          { id: 'style', label: 'Style' },
          { id: 'attributes', label: 'Attributes' },
        ]}
        bind:current={tab}
        onclose={() => {}}
      >
        {#snippet head()}
          <Button variant="ghost" icon aria-label="Delete" tone="danger"><Icon name="trash-2" /></Button>
        {/snippet}
        {#if tab === 'style'}
          <InspectorSection title="Fill">
            <FieldList fields={fill} onchange={set} />
          </InspectorSection>
          <InspectorSection title="Stroke" collapsible>
            <FieldList fields={stroke} onchange={set} />
          </InspectorSection>
          <InspectorSection title="More" collapsible open={false}>
            <FieldList fields={more} onchange={set}>
              {#snippet field()}
                <Button trailing="chevron-down" clamp>
                  {#snippet mark()}<Swatch shape="icon" icon="point" color={String(style.fill)} />{/snippet}
                  Point
                </Button>
              {/snippet}
            </FieldList>
          </InspectorSection>
        {:else}
          <InspectorSection title="Attributes" flush>
            <AttributeList
              items={attributes}
              locked={['id']}
              hide={(key) => key.startsWith('_')}
              onchange={(i, item) => (attributes[i] = item)}
              onadd={(item) => attributes.push(item)}
              onremove={(i) => attributes.splice(i, 1)}
            />
          </InspectorSection>
        {/if}
      </InspectorFrame>
    </div>
  </Case>
  <Case label="A group: no tabs, the display, the things it holds and an action in the foot">
    <div class="frame short">
      <InspectorFrame
        title={group}
        ontitle={(next) => (group = next || group)}
        subtitle={`Group of ${members.length}`}
        icon="ungroup"
        onclose={() => {}}
      >
        <InspectorSection title="Display">
          <FieldList
            fields={display}
            onchange={(key, value) => {
              if (key === 'visible') visible = value === true;
              else locked = value === true;
            }}
          />
        </InspectorSection>
        <InspectorSection title="Contents" flush>
          <Tree label="Contents" flat>
            {#each members as m (m.id)}
              <TreeRow grip={false} onclick={() => {}}>
                <Markbox><Swatch shape="dot" color={m.color} /></Markbox>
                <Text as="span" clamp>{m.name}</Text>
                {#snippet end()}<Icon name="chevron-right" />{/snippet}
              </TreeRow>
            {/each}
          </Tree>
        </InspectorSection>
        {#snippet end()}
          <Footer>
            {#snippet primary()}<Button>Ungroup</Button>{/snippet}
          </Footer>
        {/snippet}
      </InspectorFrame>
    </div>
  </Case>
  <Case label="underHead: a band of the application between the head and the tabs">
    <div class="frame short">
      <InspectorFrame
        title={note}
        ontitle={(next) => (note = next || note)}
        subtitle="Note"
        tabs={[
          { id: 'style', label: 'Style' },
          { id: 'attributes', label: 'Attributes' },
        ]}
        bind:current={noteTab}
        onclose={() => {}}
      >
        {#snippet underHead()}
          <Block>
            <ColorGrid {colors} value={noteColor} columns={5} label="Color" onselect={(hex) => (noteColor = hex)} />
          </Block>
        {/snippet}
        {#if noteTab === 'style'}
          <InspectorSection title="Text">
            <FieldList
              fields={[{ key: 'size', kind: 'number', label: 'Size', value: 14, unit: 'px', min: 1 }]}
            />
          </InspectorSection>
        {:else}
          <InspectorSection title="Attributes" flush>
            <AttributeList items={[{ key: 'Author', value: 'Kim' }]} />
          </InspectorSection>
        {/if}
      </InspectorFrame>
    </div>
  </Case>
</Example>

<style>
  .frame {
    display: flex;
    height: 36rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 28rem;
  }
</style>
