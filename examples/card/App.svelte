<script lang="ts">
  import { Badge, Button, Card, Grid, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
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
  <Case label="A title with a Badge at its end: the Badge hangs into the padding">
    <Card>
      <Text role="h2">Team plan{#snippet end()}<Badge>New</Badge>{/snippet}</Text>
      <Text role="caption">Seven members, 20 GB of storage.</Text>
    </Card>
  </Case>
  <Case label="A narrow card: the title keeps at least four of its characters beside the Badge; when it cannot, the Badge moves under it">
    <Surface width="9rem">
      <Card>
        <Text role="h2">Free{#snippet end()}<Badge>Current plan</Badge>{/snippet}</Text>
        <Text role="caption">One member.</Text>
      </Card>
    </Surface>
  </Case>
  <Case label="Plans side by side: the Badge moves under its title only where the card is too narrow">
    <Grid cols={3}>
      <Card>
        <Text role="h2">Free{#snippet end()}<Badge>Current plan</Badge>{/snippet}</Text>
        <Text role="caption">One member, 1 GB of storage.</Text>
      </Card>
      <Card>
        <Text role="h2">Team</Text>
        <Text role="caption">Seven members, 20 GB of storage.</Text>
      </Card>
      <Card>
        <Text role="h2">Business</Text>
        <Text role="caption">Any number of members, 1 TB of storage.</Text>
      </Card>
    </Grid>
  </Case>
  <Case label="A long title wraps its own words, and the Badge stays on its first line">
    <Surface width="22.5rem">
      <Card>
        <Text role="h2"
          >Team plan for a large organisation{#snippet end()}<Badge>Current plan</Badge>{/snippet}</Text
        >
        <Text role="caption">Any number of members, 1 TB of storage.</Text>
      </Card>
    </Surface>
  </Case>
  <Case label="gap md">
    <Card gap="md">
      <Text role="h2">Storage</Text>
      <Text>4 of 20 GB used.</Text>
    </Card>
  </Case>
  <Case label="danger: actions that remove something">
    <Card danger>
      <Text role="h2">Delete the team</Text>
      <Text role="caption">Every document in it is deleted. This cannot be undone.</Text>
      <Row><Button variant="danger">Delete…</Button></Row>
    </Card>
  </Case>
</Example>
