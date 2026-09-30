<script lang="ts">
  import {
    Block,
    Button,
    Field,
    Footer,
    Icon,
    List,
    ListItem,
    Panel,
    SectionHeader,
    Segmented,
    Stack,
    Text,
    TextInput,
    Toggle,
    Toolbar,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let name = $state('Front page');
  let size = $state('a4');
  let margins = $state(true);
  let picked = $state('cover');
  const pages = [
    { id: 'cover', name: 'Cover' },
    { id: 'plan', name: 'Plan' },
    { id: 'notes', name: 'Notes' },
  ];
</script>

<Example>
  <Case label="A head with the title and an action; groups stacked with gap 0; a list that reaches the edges; a Footer">
    <div class="frame">
      <Panel side="panel" label="Page">
        {#snippet head()}
          <Toolbar title="Page" rule tail>
            {#snippet end()}
              <Button variant="ghost" icon aria-label="Close"><Icon name="x" /></Button>
            {/snippet}
          </Toolbar>
        {/snippet}
        <Stack gap={0}>
          <SectionHeader label="General">
            <Field label="Name" for="panel-name">
              <TextInput id="panel-name" bind:value={name} />
            </Field>
          </SectionHeader>
          <SectionHeader label="Paper" gap="md">
            <Segmented
              ariaLabel="Size"
              bind:value={size}
              options={[
                { value: 'a4', label: 'A4' },
                { value: 'a3', label: 'A3' },
                { value: 'letter', label: 'Letter' },
              ]}
            />
            <Toggle bind:checked={margins} label="Margins" between />
          </SectionHeader>
          <SectionHeader label="Pages" flush>
            {#snippet actions()}
              <Button variant="ghost" icon aria-label="Add a page"><Icon name="plus" /></Button>
            {/snippet}
            <List label="Pages">
              {#each pages as p (p.id)}
                <ListItem columns="minmax(0, 1fr)" sel={picked === p.id} onclick={() => (picked = p.id)}>
                  <span>{p.name}</span>
                </ListItem>
              {/each}
            </List>
          </SectionHeader>
          <Block>
            <Text role="caption" muted>The content scrolls when it is taller than the panel.</Text>
          </Block>
        </Stack>
        {#snippet foot()}
          <Footer>
            {#snippet cancel()}<Button>Reset</Button>{/snippet}
            {#snippet primary()}<Button variant="primary">Apply</Button>{/snippet}
          </Footer>
        {/snippet}
      </Panel>
    </div>
  </Case>
</Example>

<style>
  /* The panel fills the height of its frame, as it fills a side of the window */
  .frame {
    display: flex;
    height: 34rem;
    background: var(--kata-color-ground);
  }
</style>
