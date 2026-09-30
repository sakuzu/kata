<script lang="ts">
  import { Progress, Row, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="A value, with a sentence above it">
    <Stack gap="xs">
      <Row between><Text>Importing 3 of 8 files</Text><Text tabular>38%</Text></Row>
      <Progress value={38} label="Importing" />
    </Stack>
  </Case>
  <Case label="Indeterminate">
    <Progress label="Uploading" />
  </Case>
  <Case label="Done">
    <Progress value={8} max={8} label="Imported" />
  </Case>
</Example>
