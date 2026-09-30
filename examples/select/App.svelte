<script lang="ts">
  import { Block, Field, Select, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  const sorts = [
    { value: 'name', label: 'Name' },
    { value: 'changed', label: 'Last changed', description: 'The newest first' },
    { value: 'created', label: 'Created', description: 'The oldest first' },
    { value: 'size', label: 'Size' },
    { value: 'owner', label: 'Owner' },
  ];
  let sort = $state('changed');
</script>

<Example>
  <Case label="A value, a placeholder, an error and disabled">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <Select options={sorts} bind:value={sort} ariaLabel="Sort" />
          <Select options={sorts} placeholder="Sort by" ariaLabel="Sort by" />
          <Select options={sorts} placeholder="Choose one" error ariaLabel="Order" />
          <Select options={sorts} value="size" disabled ariaLabel="Fixed order" />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="In a field, and the small button">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="lg">
          <Field label="Sort" for="select-sort">
            <Select id="select-sort" options={sorts} bind:value={sort} />
          </Field>
          <Small><Select options={sorts} value="name" ariaLabel="Sort the rows" /></Small>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
