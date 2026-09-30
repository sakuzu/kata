<script lang="ts">
  import { FieldList, type FieldSpec, InspectorSection, Stack, Swatch } from '@sakuzu/kata/svelte';
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
              <Swatch shape="dot" color={String(spec.value)} />
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
</Example>
