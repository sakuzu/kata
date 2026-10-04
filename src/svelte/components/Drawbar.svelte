<script lang="ts" module>
  import type { Snippet } from 'svelte';
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

  /** One switch of a Drawbar: an aid that is on or off (snapping, a grid), after the tools */
  export interface DrawbarToggle {
    id: string;
    /** The name of the switch, read by assistive technology and shown in its tooltip */
    label: string;
    icon: IconSource;
    on: boolean;
    /** Called with the state the switch asks for; without it, pressing the switch does nothing */
    onchange?: (on: boolean) => void;
    /** The key that switches it, shown in its tooltip */
    kbd?: string;
    disabled?: boolean;
    /**
     * The settings of the aid: pressing the switch opens a Popover with this snippet, which
     * receives the close function, instead of calling onchange
     */
    popover?: Snippet<[close: () => void]>;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import { untrack } from 'svelte';
  import { fitBar } from '../lib/fitBar.js';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import MenuDivider from './MenuDivider.svelte';
  import MenuItem from './MenuItem.svelte';
  import Popover from './Popover.svelte';

  // Drawbar: the toolbar of drawing tools that floats at the bottom centre of the stage.
  // Each tool is a ghost icon button; the current tool is on. Tools with the same group sit side by
  // side and the groups are gap-md apart, with pad-sm inside and one line around the whole bar (no
  // lines between tools). A tool with tone="danger" turns red on hover. The switches (toggles), such
  // as snapping, form one more group after the tools; a switch that is on is pressed.
  //
  // It is placed absolutely in its positioned container, centred; bottom is its distance from the
  // container's bottom edge, a step of the gap scale. When the bar does not fit the container, the
  // tools and switches that do not fit fold into a "More" menu at the right end: the current tool
  // always shows, then the others from the start as long as they fit. Pressing a tool calls
  // onselect with its id; the application decides what is current. Pressing a switch calls its
  // onchange with the state it asks for; a switch with a popover opens it above the bar instead,
  // and on is only what it shows. Each button shows its name and its key in a Tooltip.
  //
  //
  // column stands the tools in one column instead, the groups gap-md apart, in the flow of its
  // container (bottom does not apply), and folds nothing into "More".
  //
  //   <Drawbar label="Tools" {tools} {toggles} current={tool} onselect={(id) => (tool = id)} />
  type Step = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  let {
    tools,
    toggles = [],
    current,
    onselect,
    label,
    bottom = 'md',
    column = false,
  }: {
    /** The tools, in order */
    tools: DrawbarTool[];
    /** The switches after the tools, in order */
    toggles?: DrawbarToggle[];
    /** The id of the current tool */
    current?: string;
    /** Called with the id of the tool that is pressed */
    onselect?: (id: string) => void;
    /** The name of the bar */
    label?: string;
    /** The distance from the bottom edge of the container: 0 or a gap step */
    bottom?: 0 | Step;
    /** One column of tools, in the flow of its container, with nothing folded into "More" */
    column?: boolean;
  } = $props();

  type Item = { kind: 'tool'; tool: DrawbarTool } | { kind: 'toggle'; toggle: DrawbarToggle };

  // The items in order, and the group of each: consecutive tools of the same group form one group,
  // and the switches one more
  const items = $derived<Item[]>([
    ...tools.map((tool): Item => ({ kind: 'tool', tool })),
    ...toggles.map((toggle): Item => ({ kind: 'toggle', toggle })),
  ]);
  const groupOf = $derived.by(() => {
    const out: number[] = [];
    let g = -1;
    let last: string | undefined;
    for (const [i, t] of tools.entries()) {
      if (i === 0 || t.group !== last) g += 1;
      out.push(g);
      last = t.group;
    }
    return [...out, ...toggles.map(() => g + 1)];
  });
  const keep = $derived(tools.findIndex((t) => t.id === current));

  let bar = $state<HTMLElement>();
  // The indexes of the items that show, or null when all fit
  let shownIdx = $state<number[] | null>(null);
  $effect(() => {
    const el = bar;
    const container = el?.parentElement;
    if (!el || !container) return;
    // A column shows every tool
    if (column) {
      if (untrack(() => shownIdx) !== null) shownIdx = null;
      return;
    }
    const groups = groupOf;
    const k = keep;
    const px = (v: string) => Number.parseFloat(v) || 0;
    const read = () => {
      const cs = getComputedStyle(el);
      const group = el.querySelector<HTMLElement>('.group');
      const button = el.querySelector<HTMLElement>('[data-h="icon-button"]');
      const next = fitBar(groups, k, {
        button: button?.getBoundingClientRect().width ?? 0,
        itemGap: group ? px(getComputedStyle(group).columnGap) : 0,
        groupGap: px(cs.columnGap),
        chrome:
          px(cs.paddingLeft) +
          px(cs.paddingRight) +
          px(cs.borderLeftWidth) +
          px(cs.borderRightWidth),
        // The bar keeps gap-md from each side of its container, the same as its gap
        available: container.clientWidth - 2 * px(cs.columnGap),
      });
      if (String(next) !== String(untrack(() => shownIdx))) shownIdx = next;
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    // The container's width, and the bar's own size, which follows the text size. A change is
    // measured in the next frame, not in the delivery, so that what it writes is not delivered in
    // the same frame again
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    });
    ro.observe(container);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  });

  const shown = $derived.by(() => {
    const set = shownIdx ? new Set(shownIdx) : null;
    const out: Item[][] = [];
    let last = -1;
    for (const [i, item] of items.entries()) {
      if (set && !set.has(i)) continue;
      if (groupOf[i] !== last) out.push([]);
      out[out.length - 1].push(item);
      last = groupOf[i];
    }
    return out;
  });
  const hidden = $derived(shownIdx ? items.filter((_, i) => !shownIdx?.includes(i)) : []);
  const hiddenTools = $derived(hidden.flatMap((h) => (h.kind === 'tool' ? [h.tool] : [])));
  const hiddenToggles = $derived(hidden.flatMap((h) => (h.kind === 'toggle' ? [h.toggle] : [])));
  const key = (item: Item) => `${item.kind}:${item.kind === 'tool' ? item.tool.id : item.toggle.id}`;
</script>

<div
  class="drawbar"
  class:column
  data-role="drawbar"
  data-outline
  role="toolbar"
  aria-label={label}
  aria-orientation={column ? 'vertical' : undefined}
  style:bottom={column ? undefined : bottom === 0 ? '0' : `var(--kata-gap-${bottom})`}
  bind:this={bar}
>
  {#each shown as group, g (g)}
    <div class="group">
      {#each group as item (key(item))}
        {#if item.kind === 'tool'}
          {@const t = item.tool}
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
        {:else if item.toggle.popover}
          {@const s = item.toggle}
          {@const content = item.toggle.popover}
          <Popover align="end" up>
            {#snippet anchor(toggle, open)}
              <Button
                variant="ghost"
                icon
                on={s.on}
                disabled={s.disabled}
                aria-label={s.label}
                aria-keyshortcuts={s.kbd}
                shortcut={s.kbd}
                aria-pressed={s.on}
                aria-haspopup="true"
                aria-expanded={open}
                onclick={toggle}><Icon name={s.icon} /></Button
              >
            {/snippet}
            {#snippet children(close)}{@render content(close)}{/snippet}
          </Popover>
        {:else}
          {@const s = item.toggle}
          <Button
            variant="ghost"
            icon
            on={s.on}
            disabled={s.disabled}
            aria-label={s.label}
            aria-keyshortcuts={s.kbd}
            shortcut={s.kbd}
            aria-pressed={s.on}
            onclick={() => s.onchange?.(!s.on)}><Icon name={s.icon} /></Button
          >
        {/if}
      {/each}
    </div>
  {/each}
  {#if hidden.length}
    <div class="group">
      <Dropdown align="end" menu role="icon-button">
        {#snippet trigger(toggle, open)}
          <Button
            variant="ghost"
            icon
            aria-label={getMessages().more}
            aria-haspopup="menu"
            aria-expanded={open}
            onclick={toggle}><Icon name="ellipsis" /></Button
          >
        {/snippet}
        {#snippet panel(close)}
          {#each hiddenTools as t (t.id)}
            <MenuItem
              icon={t.icon}
              kbd={t.kbd}
              danger={t.tone === 'danger'}
              disabled={t.disabled}
              onclick={() => {
                onselect?.(t.id);
                close();
              }}>{t.label}</MenuItem
            >
          {/each}
          {#if hiddenTools.length && hiddenToggles.length}<MenuDivider />{/if}
          {#each hiddenToggles as s (s.id)}
            <MenuItem
              checked={s.on}
              kbd={s.kbd}
              disabled={s.disabled}
              onclick={() => {
                s.onchange?.(!s.on);
                close();
              }}>{s.label}</MenuItem
            >
          {/each}
        {/snippet}
      </Dropdown>
    </div>
  {/if}
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
    @include surface(panel);
    color: color(text);
    border: bw() solid color(line-strong);
    max-width: calc(100% - #{gap(md)} * 2);
    // What does not fit folds into "More"; the bar scrolls only when not even that fits
    overflow-x: auto;
    @include scope-box(button);
    // The groups keep their size
    > :global(*) {
      flex: none;
    }
  }
  .group {
    display: flex;
    align-items: center;
    gap: gap(2xs);
  }
  // One column in the flow of its container: the groups and the tools of each stand on top of each
  // other
  .drawbar.column {
    position: static;
    transform: none;
    flex-direction: column;
    max-width: none;
    // As tall as its place at most; beyond that it scrolls (overflow-x: auto makes y auto too)
    max-height: 100%;
    min-height: 0;
    > .group {
      flex-direction: column;
    }
  }
</style>
