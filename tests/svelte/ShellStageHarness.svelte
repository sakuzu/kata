<script lang="ts">
  // A Shell whose leftStage is bound here, for the tests of the binding: onstage reports the value
  // the shell writes, and a change of the height prop is written into the binding
  import type { ComponentProps } from 'svelte';
  import type { SheetStage } from '../../src/svelte/components/Sheet.svelte';
  import Shell from '../../src/svelte/components/Shell.svelte';

  let {
    height = 'half',
    onstage,
    ...props
  }: Omit<ComponentProps<typeof Shell>, 'leftStage'> & {
    height?: SheetStage;
    onstage?: (stage: SheetStage) => void;
  } = $props();

  let leftStage = $state<SheetStage>('half');
  $effect.pre(() => {
    leftStage = height;
  });
  $effect(() => {
    onstage?.(leftStage);
  });
</script>

<Shell {...props} bind:leftStage />
