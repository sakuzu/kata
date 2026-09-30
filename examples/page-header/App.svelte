<script lang="ts">
  import { Button, Icon, PageHeader } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The title alone">
    <PageHeader title="Documents" />
  </Case>
  <Case label="With a note">
    <PageHeader title="Notifications" note="Messages sent to you by the people you work with." />
  </Case>
  <Case label="With a trail and a button beside the title">
    <PageHeader title="Quarterly plan" note="Edited today.">
      {#snippet crumbs()}<a href="#team">Team</a><span>/</span><a href="#documents">Documents</a>{/snippet}
      {#snippet titleEnd()}
        <Button variant="ghost" icon aria-label="Rename"><Icon name="sticky-note" /></Button>
      {/snippet}
    </PageHeader>
  </Case>
  <Case label="A long title is clipped to one line">
    <PageHeader
      title="A very long title that does not fit on one line of the page and ends with an ellipsis instead of wrapping"
    />
  </Case>
</Example>
