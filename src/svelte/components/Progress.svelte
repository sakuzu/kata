<script lang="ts">
  import '../styles/components.css';

  // Progress: the progress of a task, a bar gap-2xs high. With a value the fill grows from the
  // left; without one (indeterminate) a block runs across. A sentence such as "Importing 3 of 8
  // files" goes above it, in a Stack. How much of a limit is used is a Meter.
  //
  //   <Progress value={38} />   <Progress label="Uploading" />
  let {
    value,
    max = 100,
    label,
  }: {
    /** The amount done; without it the bar is indeterminate */
    value?: number;
    max?: number;
    /** The accessible name of the bar */
    label?: string;
  } = $props();

  const indet = $derived(value === undefined);
  const pct = $derived(
    indet || max <= 0 ? 0 : Math.max(0, Math.min(100, ((value ?? 0) / max) * 100)),
  );
</script>

<div
  class="progress"
  data-role="progress"
  class:indet
  role="progressbar"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
>
  <div class="fill" style:width={indet ? undefined : `${pct}%`}></div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .progress {
    position: relative;
    height: gap(2xs);
    background: color(line);
    overflow: hidden;
    min-width: 0;
    flex: none;
  }
  .fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: color(solid);
  }
  // Indeterminate: a block of 30% runs from left to right. With reduced motion it rests at the
  // centre
  .indet .fill {
    width: 30%;
    left: 35%;
    animation: flow 1.6s ease-in-out infinite;
  }
  @keyframes flow {
    0% {
      transform: translateX(-135%);
    }
    100% {
      transform: translateX(135%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .indet .fill {
      animation: none;
    }
  }
</style>
