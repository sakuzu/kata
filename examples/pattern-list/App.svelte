<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import {
    Bulk,
    Button,
    Checkbox,
    Icon,
    Kebab,
    List,
    ListItem,
    Pager,
    Row,
    SearchInput,
    Stack,
    State,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';

  const all = [
    { id: 'a', name: 'Quarterly plan', changed: 'Today' },
    { id: 'b', name: 'Floor sketch', changed: 'Yesterday' },
    { id: 'c', name: 'Team notes', changed: '12 Sep' },
    { id: 'd', name: 'Spring catalogue', changed: '3 Sep' },
  ];
  let query = $state('');
  let picked = $state<string[]>(['b']);
  let page = $state(1);
  let last = $state('');
  const shown = $derived(all.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())));
  const toggle = (id: string, on: boolean) =>
    (picked = on ? [...picked, id] : picked.filter((p) => p !== id));
</script>

{#snippet bulkActions()}
  <Button leading="copy" onclick={() => (last = `duplicated ${picked.length}`)}>Duplicate</Button>
  <Button variant="danger" onclick={() => (last = `deleted ${picked.length}`)}>Delete…</Button>
  <Button variant="ghost" icon aria-label="Clear the selection" onclick={() => (picked = [])}>
    <Icon name="x" />
  </Button>
{/snippet}

<Example>
  <Case label="A search and the action that creates, the items with a check box and a Kebab, the bar of the selection, the pages">
    <Stack gap="md">
      <Row between wrap>
        <Frame width="22.5rem">
          <SearchInput bind:value={query} label="Search the documents" placeholder="Search" />
        </Frame>
        <Button variant="primary" leading="plus">New document</Button>
      </Row>
      {#if picked.length}
        <Bulk count={picked.length} label="selected" actions={bulkActions} />
      {/if}
      {#if shown.length}
        <List label="Documents">
          {#each shown as doc (doc.id)}
            <ListItem columns="auto auto minmax(0, 1fr) auto auto" tail plain rule sel={picked.includes(doc.id)}>
              <Checkbox
                checked={picked.includes(doc.id)}
                ariaLabel={`Select ${doc.name}`}
                onchange={(on) => toggle(doc.id, on)}
              />
              <Icon name={FileText} />
              <Text clamp>{doc.name}</Text>
              <Text role="caption" muted>{doc.changed}</Text>
              <Kebab actions={['copy', 'move', 'delete']} onaction={(a) => (last = `${a} ${doc.name}`)} />
            </ListItem>
          {/each}
        </List>
        <Row justify="end"><Pager {page} pages={4} onchange={(p) => (page = p)} /></Row>
      {:else}
        <State text="No document matches “{query}”.">
          {#snippet actions()}<Button onclick={() => (query = '')}>Clear the search</Button>{/snippet}
        </State>
      {/if}
      <Text role="caption" muted>Last action: {last || 'none'}</Text>
    </Stack>
  </Case>
  <Case label="The same list when it is empty">
    <State text="No documents yet." note="Documents you create or that are shared with you show here.">
      {#snippet actions()}<Button leading="plus">New document</Button>{/snippet}
    </State>
  </Case>
</Example>
