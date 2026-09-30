<script lang="ts">
  import '../styles/components.css';

  // Toggle: a switch for a setting that takes effect at once. It is a control of the height of a
  // small button, and the whole control is pressed. The switch is centred; its text on the right
  // (on the left with between) is trimmed to its ink and centred. It is a native checkbox with
  // role="switch", so :checked holds the state, and the control is a <label>, so pressing the text
  // switches it too.
  //
  //   <Toggle bind:checked={snap} label="Snap to grid" />
  //   <Toggle bind:checked={snap} label="Snap to grid" between />   the switch at the right end
  let {
    checked = $bindable(false),
    label,
    ariaLabel,
    disabled = false,
    between = false,
    indent = false,
    id,
    onchange,
  }: {
    checked?: boolean;
    /** The text beside the switch, which is its name */
    label?: string;
    /** The text on the left and the switch at the right end (a row of settings) */
    between?: boolean;
    /** Under a parent switch: indented by pad-md */
    indent?: boolean;
    /** The accessible name when there is no text */
    ariaLabel?: string;
    disabled?: boolean;
    id?: string;
    onchange?: (checked: boolean) => void;
  } = $props();
</script>

<label class="ctl" class:disabled={disabled} class:between class:indent data-role="switch" data-control>
  {#if between && label}<span class="t grow">{label}</span>{/if}
  <input
    type="checkbox"
    role="switch"
    class="toggle"
    bind:checked
    {id}
    {disabled}
    aria-label={ariaLabel}
    onchange={() => onchange?.(checked)}
  />
  {#if label && !between}<span class="t">{label}</span>{/if}
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
  .between {
    justify-content: space-between;
  }
  .indent {
    padding-left: pad(md);
  }
  // The control has a fixed height, so the text is one line
  .t {
    display: block;
    min-width: 0;
    @include trim;
    @include ellipsis;
  }
  .grow {
    flex: 1 1 auto;
  }
  // The knob is a square that leaves two lines of room inside the track. An input draws no
  // pseudo-elements, so the knob is its background image.
  .toggle {
    appearance: none;
    margin: 0;
    padding: 0;
    flex: none;
    width: h(button);
    height: h(badge);
    border: bw() solid color(line-strong);
    border-radius: 0;
    cursor: pointer;
    background-color: transparent;
    background-image: linear-gradient(color(muted) 0 0);
    background-repeat: no-repeat;
    background-size: calc(#{h(badge)} - #{bw()} * 6) calc(#{h(badge)} - #{bw()} * 6);
    background-position: left calc(#{bw()} * 2) center;
    transition:
      background-color 0.12s ease,
      border-color 0.12s ease;
  }
  .toggle:checked {
    background-color: color(solid);
    background-image: linear-gradient(color(on-solid) 0 0);
    background-position: right calc(#{bw()} * 2) center;
    border-color: color(solid);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    .toggle {
      cursor: default;
    }
  }
</style>
