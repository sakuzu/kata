<script lang="ts">
  import {
    Block,
    Button,
    Field,
    Icon,
    List,
    ListItem,
    type PickerSource,
    Row,
    SectionHeader,
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
  let flushPlace = $state('library');
  let flushLink = $state('');
  let picked = $state('Site plan');
  const shared = ['Site plan', 'Cover', 'Elevation'];
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

{#snippet flushDetail(source: PickerSource)}
  {#if source.id === 'device'}
    <Block>
      <Stack gap="md">
        <Text>Choose an image or a drawing from this device.</Text>
        <Row><Button>Choose a file…</Button></Row>
      </Stack>
    </Block>
  {:else if source.id === 'library'}
    <SectionHeader label="Shared with the team" flush>
      <List label="Shared with the team">
        {#each shared as name (name)}
          <ListItem
            columns="auto minmax(0, 1fr)"
            sel={picked === name}
            aria-current={picked === name ? 'true' : undefined}
            onclick={() => (picked = name)}
          >
            <Icon name="image" /><span>{name}</span>
          </ListItem>
        {/each}
      </List>
    </SectionHeader>
  {:else}
    <Block>
      <Field label="Address" for="picker-link-flush" note="The page must be open to everyone.">
        <TextInput id="picker-link-flush" type="url" bind:value={flushLink} />
      </Field>
    </Block>
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
  <Case label="flush: the detail places its own Blocks, Lists and SectionHeaders">
    <SourcePicker
      inline
      flush
      title="Add an image"
      {sources}
      current={flushPlace}
      onpick={(id) => (flushPlace = id)}
      detail={flushDetail}
      primary={add}
    />
  </Case>
</Example>
