<script lang="ts">
  import '../styles/components.css';

  // StepBar: the progress through a sequence of steps (an import, an onboarding). Each step is a
  // number in a square of a badge's height (done: filled; current: a blue line; to come: a line)
  // and its name; the number is trimmed to its ink and centred, the name is not trimmed. gap-sm
  // lies between a number and its name and between steps; the lines between the steps share the
  // rest of the width and shrink first. It stays on one line: when the steps do not fit (measured),
  // each name goes under its number, centred and wrapping (stack), and when even that does not
  // fit, only the numbers show and the current step's name is written under the bar, at the start
  // (numbers). It cannot be pressed: steps that are chosen are tabs.
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

  // The form that fits. A form that overflows gives way to the next one, and the width it needed
  // is kept, so that it comes back when the bar is that wide again. The bar and its steps are
  // read when they change size, and the form is written in the next animation frame
  let el = $state<HTMLElement>();
  let form = $state<'row' | 'stack' | 'numbers'>('row');
  $effect(() => {
    const ol = el;
    if (!ol) return;
    // A new list of steps starts again from one row
    void steps.join('\n');
    form = 'row';
    const need = { row: Number.POSITIVE_INFINITY, stack: Number.POSITIVE_INFINITY };
    let now: 'row' | 'stack' | 'numbers' = 'row';
    let frame = 0;
    const read = () => {
      const width = ol.clientWidth;
      // Half a pixel of room for rounding
      const over = ol.scrollWidth > width + 0.5;
      let next = now;
      if (now === 'row') {
        if (over) {
          need.row = ol.scrollWidth;
          next = 'stack';
        }
      } else if (width + 0.5 >= need.row) next = 'row';
      else if (now === 'stack') {
        if (over) {
          need.stack = ol.scrollWidth;
          next = 'numbers';
        }
      } else if (width + 0.5 >= need.stack) next = 'stack';
      if (next === now) return;
      now = next;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        form = now;
      });
    };
    if (typeof ResizeObserver === 'undefined') return;
    // The bar's width, and the size of each step, which changes with the form
    const ro = new ResizeObserver(read);
    ro.observe(ol);
    for (const step of ol.querySelectorAll(':scope > .step')) ro.observe(step);
    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<ol
  class="steps"
  data-role="bar"
  data-stack={form === 'stack' ? '' : undefined}
  data-numbers={form === 'numbers' ? '' : undefined}
  bind:this={el}
>
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
  {#if form === 'numbers' && steps[current - 1] !== undefined}
    <li class="caption" aria-hidden="true">{steps[current - 1]}</li>
  {/if}
</ol>

<style lang="scss">
  @use '../styles/kata' as *;

  .steps {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
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
  // The lines between the steps share the rest of the width, and shrink first
  .bar {
    flex: 1 1 0;
    min-width: gap(sm);
    height: bw();
    background: color(line);
  }
  // Stacked: each name under its number, centred and allowed to wrap; the lines run level with
  // the centre of the numbers (a line drawn across the middle of a box as tall as a number)
  .steps[data-stack] {
    align-items: flex-start;
    .step {
      flex-direction: column;
      text-align: center;
      white-space: normal;
    }
    .bar {
      height: h(badge);
      background: linear-gradient(#{color(line)}, #{color(line)}) center / 100% #{bw()} no-repeat;
    }
  }
  // Only the numbers: the names are left to screen readers, and the current step's name is
  // written under the bar, at the start
  .steps[data-numbers] {
    flex-wrap: wrap;
    .name {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      // Written as a string: inset() is a function of kata.scss
      clip-path: #{'inset(50%)'};
      white-space: nowrap;
    }
  }
  .caption {
    flex: 1 0 100%;
    color: color(text);
  }
</style>
