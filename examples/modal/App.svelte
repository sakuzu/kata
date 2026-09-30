<script lang="ts">
  import {
    Banner,
    Block,
    Button,
    Field,
    Modal,
    Row,
    Stack,
    Text,
    TextInput,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  // The modal opens with the page; Escape, the close button or a press on the scrim closes it
  let open = $state(true);
  let name = $state('');
  let inlineName = $state('Quarterly plan');
  let step = $state(1);
</script>

<Example>
  <Case label="A modal over the page: open it again with the button">
    <Row><Button onclick={() => (open = true)}>New document…</Button></Row>
    <Modal bind:open title="New document">
      <Banner tone="info">Everyone in the team can open it.</Banner>
      <Field label="Name" for="modal-name" note="Shown in the list of documents.">
        <TextInput id="modal-name" bind:value={name} />
      </Field>
      {#snippet cancel()}<Button onclick={() => (open = false)}>Cancel</Button>{/snippet}
      {#snippet primary()}
        <Button variant="primary" onclick={() => (open = false)}>Create</Button>
      {/snippet}
    </Modal>
  </Case>
  <Case label="The same surface in the flow (inline), with the three actions of the Footer">
    <Modal inline title="Rename">
      <Field label="Name" for="modal-inline-name">
        <TextInput id="modal-inline-name" bind:value={inlineName} />
      </Field>
      {#snippet secondary()}<Button>Reset</Button>{/snippet}
      {#snippet cancel()}<Button>Cancel</Button>{/snippet}
      {#snippet primary()}<Button variant="primary">Save</Button>{/snippet}
    </Modal>
  </Case>
  <Case label="flush: the content holds its own padding (sm)">
    <Modal inline title="Choose a template" size="sm" flush>
      <Block>
        <Stack gap="sm">
          <Text>Blank</Text>
          <Text role="caption" muted>An empty page to start from.</Text>
        </Stack>
      </Block>
      {#snippet cancel()}<Button>Close</Button>{/snippet}
    </Modal>
  </Case>
  <Case label="Steps in the band under the head, and a status on the left of the Footer">
    <Modal inline title="Import" size="lg" status="Saved a moment ago">
      {#snippet sub()}<Text role="caption" muted>Step {step} of 3</Text>{/snippet}
      <Text>Choose the file to import. Its rows become items.</Text>
      {#snippet cancel()}<Button onclick={() => (step = 1)}>Back</Button>{/snippet}
      {#snippet primary()}
        <Button variant="primary" onclick={() => (step = Math.min(3, step + 1))}>Next</Button>
      {/snippet}
    </Modal>
  </Case>
  <Case label="persistent: no close button; the Footer is the only way out">
    <Modal inline title="Access removed" size="sm" persistent>
      <Text>The owner has removed your access to this document.</Text>
      {#snippet primary()}<Button variant="primary">Go to the list</Button>{/snippet}
    </Modal>
  </Case>
</Example>
