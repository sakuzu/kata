<script lang="ts">
  import { Button, Card, Grid, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="Text, and text with an action">
    <Grid cols={2}>
      <Card>
        <Text role="h2">Team plan</Text>
        <Text role="caption">Seven members, 20 GB of storage.</Text>
      </Card>
      <Card>
        <Text role="h2">Export</Text>
        <Text role="caption">A copy of every document as files.</Text>
        <Row><Button>Export…</Button></Row>
      </Card>
    </Grid>
  </Case>
  <Case label="gap md">
    <Card gap="md">
      <Text role="h2">Storage</Text>
      <Text>4 of 20 GB used.</Text>
    </Card>
  </Case>
  <Case label="danger: actions that remove something">
    <Card danger>
      <Text role="h2">Delete the workspace</Text>
      <Text role="caption">Every document in it is deleted. This cannot be undone.</Text>
      <Row><Button variant="danger">Delete…</Button></Row>
    </Card>
  </Case>
</Example>
