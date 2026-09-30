<script lang="ts">
  import { type AttributeItem, AttributeList, InspectorSection, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let items = $state<AttributeItem[]>([
    { key: 'id', value: 'a41f' },
    { key: 'Kind', value: 'Entrance' },
    { key: 'Capacity', value: '320' },
    { key: 'Note', value: '' },
    { key: '_order', value: '7' },
  ]);
</script>

<Example>
  <Case label="Editable: a locked name, an empty value, a name kept by the application hidden">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Attributes" flush>
          <AttributeList
            {items}
            locked={['id']}
            hide={(key) => key.startsWith('_')}
            onchange={(i, item) => (items[i] = item)}
            onadd={(item) => items.push(item)}
            onremove={(i) => items.splice(i, 1)}
          />
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
  <Case label="Read only, and empty">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Attributes" flush>
          <AttributeList items={items.slice(1, 3)} readonly />
        </InspectorSection>
        <InspectorSection title="Attributes of the page" rule flush>
          <AttributeList items={[]} readonly />
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
</Example>
