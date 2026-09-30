<script lang="ts">
  import { type SearchGroup, SearchPanel } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const groups: SearchGroup[] = [
    {
      label: 'Shapes',
      items: [
        { id: 's1', label: 'Front entrance', hint: 'Page 1 · Outline', icon: 'polygon' },
        { id: 's2', label: 'Loading bay', hint: 'Page 1 · Outline', icon: 'polygon' },
        { id: 's3', label: 'Route to the hall', hint: 'Page 2', icon: 'polyline' },
      ],
    },
    {
      label: 'Notes',
      items: [
        { id: 'n1', label: 'Check the door widths', icon: 'sticky-note' },
        { id: 'n2', label: 'Ask about the loading hours', icon: 'sticky-note' },
      ],
    },
  ];
  let query = $state('');
  let picked = $state('');
  let remote = $state('');
</script>

<Example>
  <Case label="The panel filters the results as the query is typed; Enter picks the first">
    <div class="frame">
      <SearchPanel
        {groups}
        bind:query
        placeholder="Find a shape or a note"
        onpick={(id) => (picked = id)}
        onclose={() => {}}
      />
    </div>
  </Case>
  <Case label="A query without a result">
    <div class="frame short">
      <SearchPanel {groups} query="stairs" />
    </div>
  </Case>
  <Case label="filter false: the application searches, and the hint shows while the query is empty">
    <div class="frame short">
      <SearchPanel
        groups={remote ? groups.slice(1) : []}
        filter={false}
        onquery={(q) => (remote = q)}
        hint="Type to search every page."
      />
    </div>
  </Case>
</Example>

<p hidden>{picked}</p>

<style>
  .frame {
    display: flex;
    height: 26rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 12rem;
  }
</style>
