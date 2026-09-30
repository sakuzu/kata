<script lang="ts">
  import {
    Button,
    Field,
    type PickerSource,
    Row,
    SourcePicker,
    Stack,
    Text,
    TextInput,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const sources: PickerSource[] = [
    { id: 'device', label: 'This device', description: 'A file from your computer', icon: 'plus' },
    { id: 'library', label: 'Library', description: 'Shared with the team', icon: 'image' },
    { id: 'link', label: 'Link', icon: 'globe' },
  ];
  let open = $state(false);
  let place = $state('device');
  let inlinePlace = $state('link');
  let link = $state('');
</script>

{#snippet detail(source: PickerSource)}
  {#if source.id === 'device'}
    <Stack gap="md">
      <Text>Choose an image or a drawing from this device.</Text>
      <Row><Button>Choose a file…</Button></Row>
    </Stack>
  {:else if source.id === 'library'}
    <Text>Nothing has been shared with the team yet.</Text>
  {:else}
    <Field label="Address" for="picker-link" note="The page must be open to everyone.">
      <TextInput id="picker-link" type="url" bind:value={link} />
    </Field>
  {/if}
{/snippet}

{#snippet add()}<Button variant="primary">Add</Button>{/snippet}

<Example>
  <Case label="The picker over the page">
    <Row><Button onclick={() => (open = true)}>Add…</Button></Row>
    <SourcePicker
      bind:open
      title="Add an image"
      {sources}
      current={place}
      onpick={(id) => (place = id)}
      {detail}
      primary={add}
    />
  </Case>
  <Case label="The same surface in the flow: the places on the left, the detail on the right">
    <SourcePicker
      inline
      title="Add an image"
      {sources}
      current={inlinePlace}
      onpick={(id) => (inlinePlace = id)}
      {detail}
      primary={add}
    />
  </Case>
</Example>
