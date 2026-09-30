<script lang="ts">
  import '../styles/components.css';

  // StepBar: the progress through a sequence of steps (an import, an onboarding). Each step is a
  // number in a square of a badge's height (done: filled; current: a blue line; to come: a line)
  // and its name; the number is trimmed to its ink and centred, the name is not trimmed. gap-sm
  // lies between a number and its name and between steps; the lines between the steps share the
  // rest of the width. It wraps when it does not fit. It cannot be pressed: steps that are chosen
  // are tabs.
  //
  //   <StepBar steps={['Source', 'Range', 'Fetch', 'Review']} current={2} />
  let {
    steps,
    current,
  }: {
    /** The names of the steps */
    steps: string[];
    /** The current step, from 1 */
    current: number;
  } = $props();
</script>

<ol class="steps" data-role="bar">
  {#each steps as label, i (i)}
    {#if i > 0}<li class="bar" aria-hidden="true"></li>{/if}
    <li
      class="step"
      class:done={i + 1 < current}
      class:now={i + 1 === current}
      aria-current={i + 1 === current ? 'step' : undefined}
    >
      <span class="n" data-h="badge"><span class="t">{i + 1}</span></span><span class="name"
        >{label}</span
      >
    </li>
  {/each}
</ol>

<style lang="scss">
  @use '../styles/kata' as *;

  .steps {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    @include text(body);
  }
  .step {
    display: flex;
    align-items: center;
    gap: gap(sm);
    color: color(muted);
    white-space: nowrap;
  }
  .name {
    display: block;
    min-width: 0;
  }
  .n {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(badge);
    height: h(badge);
    border: bw() solid color(line-strong);
    flex: none;
    @include text(glyph);
    .t {
      display: block;
      @include trim;
    }
  }
  // Done: filled; the line stays, so that the square keeps the size of its neighbours
  .done .n {
    background: color(solid);
    color: color(on-solid);
  }
  .now {
    color: color(text);
  }
  .now .n {
    border-color: color(blue-ink);
    color: color(blue-ink);
  }
  // The lines between the steps share the rest of the width
  .bar {
    flex: 1 1 #{gap(md)};
    min-width: gap(sm);
    height: bw();
    background: color(line);
  }
</style>
