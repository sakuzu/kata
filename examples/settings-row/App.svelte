<script lang="ts">
  import {
    Button,
    Section,
    Select,
    SettingsRow,
    Stack,
    TextInput,
    Toggle,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let email = $state('ada@example.com');
  let snap = $state(true);
  let theme = $state<'dark' | 'light' | 'system'>('system');
</script>

<Example>
  <Case label="Rows in a section: a name with and without a description, a fixed width">
    <Stack gap={0}>
      <Section title="Account" gap="lg">
        <SettingsRow label="Email" for="row-email" width="20rem">
          <TextInput id="row-email" type="email" bind:value={email} />
        </SettingsRow>
        <SettingsRow label="Snap while drawing" description="Hold Alt to draw without snapping.">
          <Toggle bind:checked={snap} ariaLabel="Snap while drawing" />
        </SettingsRow>
        <SettingsRow label="Theme" description="The colors of the whole application.">
          {#snippet control()}
            <Select
              ariaLabel="Theme"
              bind:value={theme}
              options={[
                { value: 'system', label: 'As the system' },
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
              ]}
            />
          {/snippet}
        </SettingsRow>
        <SettingsRow label="Sign out everywhere" description="Every other session ends.">
          <Button>Sign out…</Button>
        </SettingsRow>
      </Section>
    </Stack>
  </Case>
</Example>
