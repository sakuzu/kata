<script lang="ts">
  import { Figure } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="A drawing with a fixed height">
    <Figure height="12rem" label="Three shapes">
      <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <rect x="20" y="30" width="80" height="60" fill="none" stroke="currentColor" />
        <circle cx="160" cy="60" r="30" fill="none" stroke="currentColor" />
        <polygon points="240,90 270,30 300,90" fill="none" stroke="currentColor" />
      </svg>
    </Figure>
  </Case>
  <Case label="The picture sets the height">
    <Figure>
      <svg viewBox="0 0 320 60" width="100%" role="img" aria-label="A line">
        <polyline points="10,50 80,10 160,40 240,15 310,45" fill="none" stroke="currentColor" />
      </svg>
    </Figure>
  </Case>
</Example>
