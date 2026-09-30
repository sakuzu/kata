<script lang="ts">
  import { Badge, Row, Table, Text, Thumbnail } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let picked = $state(2);
  const files = [
    { id: 1, name: 'Quarterly report', status: 'Public', size: '1.2 MB', updated: '3 minutes ago' },
    { id: 2, name: 'Site survey', status: 'Link sharing', size: '840 KB', updated: 'Yesterday' },
    { id: 3, name: 'Budget draft', status: 'Private', size: '96 KB', updated: 'Last week' },
  ];
  const tone = (s: string) =>
    s === 'Public' ? 'green' : s === 'Link sharing' ? 'yellow' : undefined;
</script>

<Example>
  <Case label="Text, numbers at the end, and a selected row (press a row)">
    <Surface>
      <Table>
        {#snippet head()}<th>Name</th><th data-align="end">Size</th><th>Updated</th>{/snippet}
        {#each files as f (f.id)}
          <tr
            tabindex="0"
            aria-selected={picked === f.id}
            onclick={() => (picked = f.id)}
            onkeydown={(e) => e.key === 'Enter' && (picked = f.id)}
          >
            <td>{f.name}</td>
            <td data-align="end">{f.size}</td>
            <td><Text role="caption" as="span">{f.updated}</Text></td>
          </tr>
        {/each}
      </Table>
    </Surface>
  </Case>
  <Case label="rows mark: rows that hold a badge line up; dividers between the headers">
    <Surface>
      <Table rows="mark" dividers>
        {#snippet head()}<th data-idx>#</th><th>Name</th><th>Status</th>{/snippet}
        {#each files as f, i (f.id)}
          <tr>
            <td data-idx>{i + 1}</td>
            <td>{f.name}</td>
            <td>
              {#if f.status !== 'Private'}<Badge tone={tone(f.status)}>{f.status}</Badge>{/if}
            </td>
          </tr>
        {/each}
      </Table>
    </Surface>
  </Case>
  <Case label="rows thumb, and a long value clipped (data-clamp)">
    <Surface>
      <Table rows="thumb">
        {#snippet head()}<th>Name</th><th>Description</th>{/snippet}
        <tr>
          <td><Row gap="sm"><Thumbnail size="2rem" /><span>Cover</span></Row></td>
          <td data-clamp>A description that is too long for its column and ends with an ellipsis</td>
        </tr>
        <tr>
          <td><Row gap="sm"><Thumbnail size="2rem" /><span>Back</span></Row></td>
          <td data-clamp>Short</td>
        </tr>
      </Table>
    </Surface>
  </Case>
  <Case label="sticky: the first and the last column stay when the table scrolls sideways">
    <Surface width="20rem">
      <Table sticky>
        {#snippet head()}<th>Name</th><th>Owner</th><th>Kind</th><th>Updated</th><th data-align="end">Size</th>{/snippet}
        {#each files as f (f.id)}
          <tr>
            <td>{f.name}</td>
            <td>Sam Lee</td>
            <td>Document</td>
            <td>{f.updated}</td>
            <td data-align="end">{f.size}</td>
          </tr>
        {/each}
      </Table>
    </Surface>
  </Case>
  <Case label="fill: the table fills its container and scrolls; the headers stay at the top">
    <Surface width="24rem">
      <div class="frame">
        <Table fill>
          {#snippet head()}<th>Name</th><th data-align="end">Size</th>{/snippet}
          {#each [...files, ...files, ...files] as f, i (i)}
            <tr><td>{f.name}</td><td data-align="end">{f.size}</td></tr>
          {/each}
        </Table>
      </div>
    </Surface>
  </Case>
</Example>

<style>
  .frame {
    height: 10rem;
  }
</style>
