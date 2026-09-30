<script lang="ts">
  import {
    Banner,
    Button,
    Checkbox,
    Field,
    Modal,
    Row,
    Select,
    Textarea,
    TextInput,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const kinds = [
    { value: 'drawing', label: 'Drawing', description: 'A blank sheet to draw on' },
    { value: 'board', label: 'Board', description: 'Notes and pictures side by side' },
  ];

  // The form in the flow of the page, as it looks inside the modal
  let name = $state('');
  let kind = $state('drawing');
  let about = $state('');
  let shared = $state(true);
  let tried = $state(false);
  const nameError = $derived(tried && !name.trim() ? 'Give the document a name.' : undefined);

  // The same form in a real modal
  let open = $state(false);
  let modalName = $state('');
</script>

<Example>
  <Case label="The fields in the body, gap-md apart; Create checks the name and shows the error in its field">
    <Modal inline title="New document">
      <Field label="Name" for="form-name" error={nameError}>
        <TextInput id="form-name" bind:value={name} error={!!nameError} />
      </Field>
      <Field label="Kind" for="form-kind">
        <Select id="form-kind" options={kinds} bind:value={kind} />
      </Field>
      <Field label="Description" for="form-about" note="Optional. Shown under the name in lists.">
        <Textarea id="form-about" bind:value={about} rows={3} />
      </Field>
      <Checkbox bind:checked={shared} label="Everyone in the team can open it" />
      {#snippet cancel()}<Button onclick={() => (tried = false)}>Cancel</Button>{/snippet}
      {#snippet primary()}
        <Button variant="primary" onclick={() => (tried = true)}>Create</Button>
      {/snippet}
    </Modal>
  </Case>
  <Case label="The same form over the page, with a notice at the top of the body">
    <Row><Button onclick={() => (open = true)}>New document…</Button></Row>
    <Modal bind:open title="New document">
      <Banner tone="info">The document is created in the current folder.</Banner>
      <Field label="Name" for="form-modal-name">
        <TextInput id="form-modal-name" bind:value={modalName} />
      </Field>
      {#snippet cancel()}<Button onclick={() => (open = false)}>Cancel</Button>{/snippet}
      {#snippet primary()}
        <Button variant="primary" onclick={() => (open = false)}>Create</Button>
      {/snippet}
    </Modal>
  </Case>
</Example>
