<script lang="ts">
  import '../styles/components.css';

  // Meter: how much of a limit is used. The name (left) and the amount (right) sit above a bar
  // gap-sm high; they are text that is not trimmed, gap-xs above the bar, as a field's name above
  // its control. Near the limit it turns yellow and over it red; where "near" begins depends on
  // the screen, so the caller sets tone. The progress of a task is a Progress.
  //
  //   <Meter value={120} max={500} label="Storage" text="120 MB of 500 MB" />
  let {
    value,
    max,
    tone,
    label,
    text,
  }: {
    value: number;
    max: number;
    /** warn: near the limit; over: past it */
    tone?: 'warn' | 'over';
    /** The name, at the left above the bar */
    label?: string;
    /** The amount as text, at the right above the bar */
    text?: string;
  } = $props();

  const pct = $derived(max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0);
</script>

<div class="meter" data-role="bar">
  {#if label !== undefined || text !== undefined}
    <div class="head">
      <span class="k">{label ?? ''}</span>
      <span class="v {tone ?? ''}">{text ?? ''}</span>
    </div>
  {/if}
  <div
    class="bar {tone ?? ''}"
    role="meter"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={value}
    aria-valuetext={text}
  >
    <div class="fill" style:width={`${pct}%`}></div>
  </div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .meter {
    display: flex;
    flex-direction: column;
    gap: gap(xs);
    min-width: 0;
    @include text(body);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: gap(sm);
    min-width: 0;
  }
  .k {
    @include ellipsis;
  }
  .v {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .v.warn {
    color: color(yellow-ink);
  }
  .v.over {
    color: color(red-ink);
  }
  .bar {
    position: relative;
    height: gap(sm);
    background: color(line);
    flex: none;
  }
  .fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: color(solid);
  }
  .bar.warn .fill {
    background: color(yellow-fill);
  }
  .bar.over .fill {
    background: color(red-ink);
  }
</style>
