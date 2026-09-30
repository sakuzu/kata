<script lang="ts" module>
  import type { IconSource } from '../icons.js';

  /** One tool of a Drawbar */
  export interface DrawbarTool {
    id: string;
    /** The name of the tool, read by assistive technology */
    label: string;
    icon: IconSource;
    /** The key that picks the tool, shown in its tooltip */
    kbd?: string;
    /** Tools with the same group sit together; groups are gap-md apart */
    group?: string;
    /** A tool that removes something: red on hover */
    tone?: 'danger';
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  // Drawbar: the toolbar of drawing tools that floats at the bottom centre of the drawing area.
  // Each tool is a ghost icon button; the current tool is on. Tools with the same group sit side by
  // side and the groups are gap-md apart, with pad-sm inside and one line around the whole bar (no
  // lines between tools). A tool with tone="danger" turns red on hover.
  //
  // It is placed absolutely in its positioned container, centred; bottom is its distance from the
  // container's bottom edge, a step of the gap scale. When it does not fit, it scrolls sideways; the
  // tools never shrink. Pressing a tool calls onselect with its id; the application decides what
  // is current. Each tool shows its name and its key in a Tooltip.
  //
  //   <Drawbar label="Tools" {tools} current={tool} onselect={(id) => (tool = id)} />
  type Step = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  let {
    tools,
    current,
    onselect,
    label,
    bottom = 'md',
  }: {
    /** The tools, in order */
    tools: DrawbarTool[];
    /** The id of the current tool */
    current?: string;
    /** Called with the id of the tool that is pressed */
    onselect?: (id: string) => void;
    /** The name of the bar */
    label?: string;
    /** The distance from the bottom edge of the container: 0 or a gap step */
    bottom?: 0 | Step;
  } = $props();

  // Consecutive tools of the same group form one group
  const groups = $derived.by(() => {
    const out: DrawbarTool[][] = [];
    let last: string | undefined;
    for (const [i, t] of tools.entries()) {
      if (i === 0 || t.group !== last) out.push([]);
      out[out.length - 1].push(t);
      last = t.group;
    }
    return out;
  });
</script>

<div
  class="drawbar"
  data-role="drawbar"
  role="toolbar"
  aria-label={label}
  style:bottom={bottom === 0 ? '0' : `var(--kata-gap-${bottom})`}
>
  {#each groups as group, g (g)}
    <div class="group">
      {#each group as t (t.id)}
        <Button
          variant="ghost"
          icon
          on={t.id === current}
          tone={t.tone}
          disabled={t.disabled}
          aria-label={t.label}
          aria-keyshortcuts={t.kbd}
          shortcut={t.kbd}
          aria-pressed={t.id === current}
          onclick={() => onselect?.(t.id)}><Icon name={t.icon} /></Button
        >
      {/each}
    </div>
  {/each}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .drawbar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: z(floating);
    display: flex;
    align-items: center;
    gap: gap(md);
    padding: pad(sm);
    background: color(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    max-width: calc(100% - #{gap(md)} * 2);
    overflow-x: auto;
    @include scope-box(button);
    // The groups keep their size; the bar scrolls instead
    > :global(*) {
      flex: none;
    }
  }
  .group {
    display: flex;
    align-items: center;
    gap: gap(2xs);
  }
</style>
