<script lang="ts">
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import Folder from '@lucide/svelte/icons/folder';
  import { Button, Grid, Gtile, Icon, Text, Thumbnail } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const picture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'%3E%3Crect width='30' height='20' fill='%23204ec3'/%3E%3Ccircle cx='10' cy='10' r='5' fill='%23f8cd09'/%3E%3C/svg%3E";
  let picked = $state('b');
</script>

<Example>
  <Case label="Tiles in a grid: a picture, a title and a caption; one selected (press to select)">
    <Grid cols={3}>
      <Gtile label="Riverside plan" sel={picked === 'a'} onclick={() => (picked = 'a')}>
        {#snippet thumb()}<Thumbnail size="full" src={picture} />{/snippet}
        <Text clamp>Riverside plan</Text>
        <Text role="caption">3 days ago</Text>
      </Gtile>
      <Gtile label="Site survey" sel={picked === 'b'} onclick={() => (picked = 'b')}>
        {#snippet thumb()}<Thumbnail size="full" />{/snippet}
        <Text clamp>Site survey</Text>
        <Text role="caption">Yesterday</Text>
      </Gtile>
      <Gtile label="Archive" href="#top">
        {#snippet thumb()}<Thumbnail size="full" icon={Folder} />{/snippet}
        <Text clamp>Archive</Text>
        <Text role="caption">12 documents</Text>
        {#snippet actions()}
          <Button variant="ghost" icon aria-label="More"><Icon name={Ellipsis} /></Button>
        {/snippet}
      </Gtile>
    </Grid>
  </Case>
</Example>
