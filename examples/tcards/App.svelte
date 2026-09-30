<script lang="ts">
  import { Tcard, Tcards } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  // Each card is placed at its y on the spine, as a virtual scroll does. The height of a row is
  // measured on a rendered card, and a gap-sm lies between the cards
  const rows = [
    { name: 'North school', place: 'Hill road' },
    { name: 'Community centre', place: 'River street' },
    { name: 'Library', place: 'Market square' },
  ];
  let rowHeight = $state(0);
  let picked = $state(1);
  $effect(() => {
    const card = document.querySelector<HTMLElement>('[data-row]');
    if (!card) return;
    const measure = () => {
      const probe = document.createElement('div');
      probe.style.height = 'var(--kata-gap-sm)';
      document.body.append(probe);
      rowHeight = card.offsetHeight + probe.offsetHeight;
      probe.remove();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  });
</script>

<Example>
  <Case label="A scrolling column of cards (press one to select it)">
    <Surface width="24rem">
      <div class="frame">
        <Tcards height="{rows.length * rowHeight}px">
          {#each rows as r, i (r.name)}
            <Tcard
              y={i * rowHeight}
              data-row
              sel={picked === i}
              role="button"
              tabindex={0}
              onclick={() => (picked = i)}
              onkeydown={(e) => e.key === 'Enter' && (picked = i)}
            >
              <dt>Name</dt>
              <dd>{r.name}</dd>
              <dt>Place</dt>
              <dd>{r.place}</dd>
            </Tcard>
          {/each}
        </Tcards>
      </div>
    </Surface>
  </Case>
</Example>

<style>
  .frame {
    height: 12rem;
  }
</style>
