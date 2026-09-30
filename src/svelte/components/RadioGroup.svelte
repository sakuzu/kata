<script lang="ts">
  import '../styles/components.css';
  import Radio from './Radio.svelte';
  import Stack from './Stack.svelte';

  // RadioGroup: a group of radios, for two to four choices that may carry a description. The
  // radios are stacked with gap 0, since each one has the height of a small button.
  //
  //   <RadioGroup name="scope" {options} bind:value={scope} />
  let {
    options,
    value = $bindable(),
    name,
    disabled = false,
  }: {
    options: { value: string; label: string; description?: string }[];
    value?: string;
    /** The name of the group, unique on the screen */
    name: string;
    disabled?: boolean;
  } = $props();
</script>

<Stack gap={0}>
  {#each options as opt (opt.value)}
    <Radio
      {name}
      {disabled}
      value={opt.value}
      label={opt.label}
      description={opt.description}
      bind:group={value}
    />
  {/each}
</Stack>
