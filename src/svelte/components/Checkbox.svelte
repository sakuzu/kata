<script lang="ts">
  import '../styles/components.css';

  // Checkbox: a choice among several, or a confirmation. It is a control of the height of a small
  // button, and the whole control is pressed. The box is the square of an icon; the text on its
  // right is trimmed to its ink and centred. It is a native checkbox, so :checked holds the state,
  // and the control is a <label>, so pressing the text switches it too.
  //
  //   <Checkbox bind:checked={shared} label="Share with the team" />
  //   <Checkbox indeterminate ariaLabel="Select all" />     some of a list is selected
  let {
    checked = $bindable(false),
    indeterminate = false,
    label,
    ariaLabel,
    disabled = false,
    id,
    onchange,
  }: {
    checked?: boolean;
    /** Some of a list is selected: the stronger surface and no check mark */
    indeterminate?: boolean;
    label?: string;
    /** The accessible name when there is no text (the first column of a list) */
    ariaLabel?: string;
    disabled?: boolean;
    id?: string;
    /** Called when the state changes, for an application that keeps the selection itself */
    onchange?: (checked: boolean) => void;
  } = $props();

  let el = $state<HTMLInputElement>();

  // indeterminate is a property of the element, not an attribute
  $effect(() => {
    if (el) el.indeterminate = indeterminate;
  });
</script>

<label class="ctl" class:disabled={disabled} data-role="switch" data-control>
  <input
    bind:this={el}
    type="checkbox"
    class="check"
    class:ind={indeterminate}
    bind:checked
    {id}
    {disabled}
    aria-label={ariaLabel}
    onchange={() => onchange?.(checked)}
  />
  {#if label}<span class="t">{label}</span>{/if}
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  .ctl {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(button-sm);
    padding-inline: inset();
    min-width: 0;
    cursor: pointer;
    @include text(body);
  }
  // The control has a fixed height, so the text is one line
  .t {
    display: block;
    min-width: 0;
    @include trim;
    @include ellipsis;
  }
  .check {
    appearance: none;
    margin: 0;
    padding: 0;
    flex: none;
    width: h(icon);
    height: h(icon);
    border: bw() solid color(line-strong);
    border-radius: 0;
    cursor: pointer;
    background: transparent;
    transition: background-color 0.12s ease;
  }
  // The check mark is the background image (an input draws no pseudo-elements). Its stroke is the
  // color of on-solid, written out because a data URI cannot read a custom property.
  .check:checked {
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E")
        center / calc(#{h(icon)} - #{bw()} * 4) no-repeat,
      color(solid);
  }
  // Some selected: the stronger surface, after the check so that it wins
  .check.ind,
  .check:indeterminate {
    background: color(raise-2);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    .check {
      cursor: default;
    }
  }
</style>
