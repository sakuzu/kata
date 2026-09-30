<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // Notices: the column of notices of an application's frame, between its top bar and the page. It
  // stacks Banners gap-md apart, with the margin of the page around them: gap-lg, and gap-md at the
  // sides below 48rem. There is none below them; the page's own margin follows. When there is no
  // notice, the application leaves it out, so that no empty margin remains.
  //
  //   {#if unverified}
  //     <Notices><Banner tone="warn">Your address is not verified yet</Banner></Notices>
  //   {/if}
  let { children }: { children: Snippet } = $props();
</script>

<div class="notices" data-role="block">
  <Stack gap="md">{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The margin of the page, as Page has it
  .notices {
    padding: gap(lg) gap(lg) 0; /* kata-allow-gap-padding */
    min-width: 0;
  }
  @include narrow {
    .notices {
      padding: gap(lg) gap(md) 0; /* kata-allow-gap-padding */
    }
  }
</style>
