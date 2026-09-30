<script lang="ts">
  import { type VersionEntry, VersionsPanel } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const versions: VersionEntry[] = [
    { id: 'v5', label: 'Autosaved 14:20', when: '10 minutes ago', by: 'Ada' },
    { id: 'v4', label: 'Before the review', when: 'Today, 11:02', by: 'Grace' },
    { id: 'v3', label: 'Autosaved 09:45', when: 'Today, 09:45', by: 'Ada' },
    { id: 'v2', label: 'First draft', when: 'Yesterday, 17:30', by: 'Ada' },
  ];
  let shown = $state('v4');
  let restored = $state('');
</script>

<Example>
  <Case label="A past version is shown: the Footer offers to go back or to restore it">
    <div class="frame">
      <VersionsPanel
        {versions}
        current={shown}
        onpreview={(id) => (shown = id)}
        onrestore={(id) => (restored = id)}
        onclose={() => {}}
      />
    </div>
  </Case>
  <Case label="The latest version is shown, and no version yet">
    <div class="pair">
      <div class="frame short">
        <VersionsPanel versions={versions.slice(0, 2)} current="v5" />
      </div>
      <div class="frame short">
        <VersionsPanel versions={[]} />
      </div>
    </div>
  </Case>
</Example>

<p hidden>{restored}</p>

<style>
  .frame {
    display: flex;
    height: 24rem;
    background: var(--kata-color-ground);
  }
  .frame.short {
    height: 12rem;
  }
  .pair {
    display: flex;
    flex-wrap: wrap;
    gap: var(--kata-gap-lg);
  }
</style>
