<script lang="ts">
  import {
    Block,
    Button,
    ColorGrid,
    FieldList,
    type FieldSpec,
    InspectorSection,
    LinkAction,
    NumberInput,
    Row,
    Slider,
    Stack,
    Swatch,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  // The values, kept by key as an application would keep them
  let values = $state<Record<string, unknown>>({
    label: 'Front entrance',
    fill: '#2F6FDE',
    opacity: 80,
    width: 2,
    dash: 'solid',
    cap: 'round',
    shadow: true,
    layer: 'above',
  });
  const set = (key: string, value: unknown) => (values[key] = value);

  const fields: FieldSpec[] = $derived([
    { key: 'label', kind: 'text', label: 'Label', value: values.label, placeholder: 'None' },
    { key: 'fill', kind: 'color', label: 'Fill', value: values.fill },
    { key: 'opacity', kind: 'slider', label: 'Opacity', value: values.opacity, unit: '%' },
    {
      key: 'width',
      kind: 'number',
      label: 'Line width',
      value: values.width,
      unit: 'px',
      min: 0,
      hint: 'Measured on the screen.',
    },
    {
      key: 'dash',
      kind: 'select',
      label: 'Line style',
      value: values.dash,
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
        { value: 'dotted', label: 'Dotted' },
      ],
    },
    {
      key: 'cap',
      kind: 'segmented',
      label: 'Ends',
      value: values.cap,
      options: [
        { value: 'butt', label: 'Flat' },
        { value: 'round', label: 'Round' },
      ],
    },
    { key: 'shadow', kind: 'toggle', label: 'Shadow', value: values.shadow },
    { key: 'layer', kind: 'custom', label: 'Marker', value: values.fill },
  ]);

  // The application's own picker, and a preview while the slider is dragged
  const own = { fill: '#1F9D55', opacity: 60 };
  let ownFill = $state(own.fill);
  let ownOpacity = $state(own.opacity);
  let preview = $state<number | null>(null);
  let picking = $state(false);
  const ownFields: FieldSpec[] = $derived([
    { key: 'fill', kind: 'color', label: 'Fill', value: ownFill },
    { key: 'opacity', kind: 'slider', label: 'Opacity', value: ownOpacity, unit: '%' },
  ]);
  const presets = [
    { name: 'Green', hex: '#1F9D55' },
    { name: 'Blue', hex: '#2F6FDE' },
    { name: 'Orange', hex: '#D9822B' },
    { name: 'Red', hex: '#E5484D' },
  ];

  // A custom field of several lines: the number, a slider and two actions
  let angle = $state(30);
  const turnFields: FieldSpec[] = $derived([
    { key: 'name', kind: 'text', label: 'Name', value: 'Front entrance' },
    { key: 'angle', kind: 'custom', label: 'Rotation', value: angle, top: true },
  ]);

  // Three things selected: the fill and the line style differ, the rest is shared
  const mixed: FieldSpec[] = [
    { key: 'fill', kind: 'color', label: 'Fill', mixed: true },
    { key: 'opacity', kind: 'slider', label: 'Opacity', mixed: true, unit: '%' },
    { key: 'width', kind: 'number', label: 'Line width', mixed: true, unit: 'px' },
    {
      key: 'dash',
      kind: 'select',
      label: 'Line style',
      mixed: true,
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
      ],
    },
    { key: 'shadow', kind: 'toggle', label: 'Shadow', value: false, disabled: true },
  ];
</script>

<Example>
  <Case label="Every kind of field, one thing selected">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Style">
          <FieldList {fields} onchange={set}>
            {#snippet field(spec)}
              <Button trailing="chevron-down" clamp mono aria-label={spec.label}>
                {#snippet mark()}<Swatch shape="dot" color={String(spec.value)} />{/snippet}
                {String(spec.value)}
              </Button>
            {/snippet}
          </FieldList>
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
  <Case label="Mixed values across a selection, and a field that is disabled">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Style">
          <FieldList fields={mixed} />
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
  <Case label="oninput while a slider is dragged, oncolor for the application's own picker, end for a reset">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Fill" value={`${preview ?? ownOpacity}%`}>
          <FieldList
            fields={ownFields}
            oninput={(_, value) => (preview = value)}
            onchange={(key, value) => {
              if (key === 'opacity') ownOpacity = Number(value);
              preview = null;
            }}
            oncolor={() => (picking = !picking)}
          >
            {#snippet end()}
              <LinkAction
                icon="undo-2"
                onclick={() => {
                  ownFill = own.fill;
                  ownOpacity = own.opacity;
                }}>Reset</LinkAction
              >
            {/snippet}
          </FieldList>
        </InspectorSection>
        {#if picking}
          <Block>
            <ColorGrid
              colors={presets}
              value={ownFill}
              columns={4}
              label="Fill"
              onselect={(hex) => {
                ownFill = hex;
                picking = false;
              }}
            />
          </Block>
        {/if}
      </Stack>
    </Surface>
  </Case>
  <Case label="top: a custom field of several lines, with the name at the top">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Position">
          <FieldList fields={turnFields}>
            {#snippet field()}
              <Stack gap="md">
                <NumberInput
                  value={angle}
                  unit="°"
                  min={0}
                  max={359}
                  ariaLabel="Rotation in degrees"
                  onchange={(e) => {
                    const n = Number(e.currentTarget.value);
                    if (e.currentTarget.value.trim() !== '' && !Number.isNaN(n)) angle = n;
                  }}
                />
                <Slider
                  value={angle}
                  min={0}
                  max={359}
                  ariaLabel="Rotation"
                  oninput={(v) => (angle = v)}
                />
                <Row wrap>
                  <Button onclick={() => (angle = 0)}>Reset</Button>
                  <Button onclick={() => (angle = (angle + 90) % 360)}>+90°</Button>
                </Row>
              </Stack>
            {/snippet}
          </FieldList>
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
</Example>
