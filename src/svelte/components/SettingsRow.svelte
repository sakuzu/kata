<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // SettingsRow: one setting. The name and an optional description on the left, the control on the
  // right, level with the middle of the text. The name is body text, the description a muted
  // caption gap-xs below it; they are trimmed only where the row meets an edge. The text column
  // takes the rest of the row and the control keeps its own width (or the width given), gap-lg
  // from the text. Below 48rem the control moves under the text, gap-sm from it, at the start.
  //
  // The row is a group named by the name and described by the description, so a screen reader
  // reads both on entering the control. With for, the name is the <label> of the control.
  //
  //   <SettingsRow label="Name" for="doc-name"><TextInput id="doc-name" bind:value={name} /></SettingsRow>
  //   <SettingsRow label="Autosave" description="Save after every change.">
  //     <Toggle bind:checked={autosave} ariaLabel="Autosave" />
  //   </SettingsRow>
  let {
    label,
    description,
    for: htmlFor,
    width,
    control,
    children,
  }: {
    /** The name of the setting */
    label: string;
    /** One sentence under the name */
    description?: string;
    /** The id of the control that the name labels */
    for?: string;
    /** A fixed width for the control (an input); without it the control keeps its own */
    width?: '8rem' | '12rem' | '20rem';
    /** The control (a snippet); children serve the same */
    control?: Snippet;
    children?: Snippet;
  } = $props();
  const id = $props.id();
</script>

<div
  class="settings-row"
  class:sized={!!width}
  data-role="settings-row"
  role="group"
  aria-labelledby="{id}-label"
  aria-describedby={description ? `${id}-description` : undefined}
  style:--kata-settings-control={width}
>
  <div class="text">
    {#if htmlFor}
      <label class="label" id="{id}-label" for={htmlFor}>{label}</label>
    {:else}
      <span class="label" id="{id}-label">{label}</span>
    {/if}
    {#if description}
      <span class="description" data-role="caption" data-ink id="{id}-description">{description}</span>
    {/if}
  </div>
  <div class="control">
    {#if control}{@render control()}{:else if children}{@render children()}{/if}
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .settings-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    column-gap: gap(lg);
    min-width: 0;
    @include scope-box(button);
  }
  .sized {
    grid-template-columns: minmax(0, 1fr) var(--kata-settings-control);
  }
  // The text column stands beside the control, so it touches the same edges as the row: it takes
  // the row's edge flags, and its first and last lines are trimmed where the row meets an edge
  .text {
    display: flex;
    flex-direction: column;
    gap: gap(xs);
    min-width: 0;
    --kata-at-start: inherit;
    --kata-at-end: inherit;
  }
  .label {
    display: block;
    @include text(body);
    color: color(text);
  }
  .description {
    display: block;
    @include text(caption);
    color: color(muted);
  }
  // The control keeps its width at the right end; with a width, it fills it
  .control {
    display: flex;
    justify-content: flex-end;
    min-width: 0;
  }
  .sized .control > :global(*) {
    flex: 1 1 auto;
    min-width: 0;
  }
  @include narrow {
    .settings-row,
    .sized {
      grid-template-columns: minmax(0, 1fr);
      row-gap: gap(sm);
    }
    // The control is under the text, so the text's last line no longer meets the row's edge
    .text {
      --kata-at-end: 0;
    }
    .control {
      justify-content: flex-start;
    }
    .sized .control {
      max-width: var(--kata-settings-control);
    }
  }
</style>
