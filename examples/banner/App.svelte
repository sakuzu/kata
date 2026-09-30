<script lang="ts">
  import { Banner, Button, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="The four tones">
    <Stack gap="md">
      <Banner tone="info">Everyone in the team can open this document.</Banner>
      <Banner tone="warn">The trial ends in 3 days.</Banner>
      <Banner tone="error">The last change could not be saved.</Banner>
      <Banner tone="ok">All changes are saved.</Banner>
    </Stack>
  </Case>
  <Case label="An action at the right end; in a narrow place it moves below the text">
    <Stack gap="md">
      <Banner tone="warn">
        The trial ends in 3 days.
        {#snippet act()}<Button>Renew</Button>{/snippet}
      </Banner>
      <Surface width="16rem">
        <Banner tone="error">
          The file could not be read.
          {#snippet act()}<Button>Try again</Button>{/snippet}
        </Banner>
      </Surface>
    </Stack>
  </Case>
  <Case label="Several lines in a Stack, and floating (the panel surface)">
    <Banner tone="info" floating>
      <Stack gap="xs">
        <Text role="label">3 people are editing</Text>
        <Text role="caption" muted>Their changes appear as they type.</Text>
      </Stack>
    </Banner>
  </Case>
</Example>
