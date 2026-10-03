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
  <span class="seat">
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
    <span class="mark" aria-hidden="true"></span>
  </span>
  {#if label}<span class="t">{label}</span>{/if}
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  .ctl {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(button-sm);
    // The inset of the container, taken once: the content takes none
    padding-inline: inset();
    min-width: 0;
    cursor: pointer;
    @include text(body);
    > * {
      --kata-inset: 0px;
    }
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
  .check:checked {
    background: color(solid);
  }
  // Some selected: the stronger surface, after the check so that it wins
  .check.ind,
  .check:indeterminate {
    background: color(raise-2);
  }
  // The box and the check mark lie on each other. An input draws no pseudo-elements, so the mark is
  // an element of its own: the text color of the fill, shown through the shape of the check
  .seat {
    position: relative;
    display: inline-flex;
    flex: none;
  }
  .mark {
    position: absolute;
    inset: 0;
    pointer-events: none;
    visibility: hidden;
    background: color(on-solid);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E")
      center / calc(#{h(icon)} - #{bw()} * 4) no-repeat;
  }
  .check:checked:not(.ind):not(:indeterminate) + .mark {
    visibility: visible;
  }
  // Disabled is the same shape without hue: the text and an empty or partial box are dimmed; a
  // checked box is the filled shape, not dimmed, with the disabled surface and its text for the mark
  .disabled {
    cursor: default;
    .check {
      cursor: default;
    }
    .t,
    .check:not(:checked),
    .check.ind,
    .check:indeterminate {
      opacity: dim();
    }
    .check:checked:not(.ind):not(:indeterminate) {
      background: color(solid-disabled);
    }
    .mark {
      background: color(solid-disabled-text);
    }
  }
</style>
