<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Dropdown from './Dropdown.svelte';
  import Icon from './Icon.svelte';
  import MenuItem from './MenuItem.svelte';

  // Tabs: switches between views. A tab has the height of a list item with pad-md at the sides; the
  // current tab is underlined with a double line drawn inside it, so its height does not change.
  // Inside a Toolbar the tabs find the toolbar on their own: they take its height, and the
  // underline meets the toolbar's line (the tabs have no line of their own there).
  //
  // A tab with href is a link (it moves to another page, as the tabs of a settings page do); a tab
  // without is a button (it switches a view on the same page). Either way the current tab has
  // aria-current="page". Only the current tab is in the tab order; the left and right arrow keys,
  // Home and End move the focus between the tabs, and Enter or Space opens the focused one.
  //
  // When the tabs do not fit, as many as fit show and the rest fold into a "More" menu at the right
  // end; nothing scrolls. The current tab always shows: its width is taken first, then the others
  // from the start as long as they fit. The widths are measured on a hidden copy of the tabs and
  // followed with a ResizeObserver.
  //
  //   <Tabs {tabs} current="general" onselect={(id) => (view = id)} label="Views" />
  type Tab = { id: string; label: string; href?: string };
  let {
    tabs,
    current,
    label,
    onselect,
  }: {
    tabs: Tab[];
    /** The id of the current tab */
    current: string;
    /** The name of the set of tabs */
    label?: string;
    /** Called with the id of the tab that is opened */
    onselect?: (id: string) => void;
  } = $props();

  let root = $state<HTMLElement>();
  let measure = $state<HTMLElement>();
  // Inside a Toolbar the tabs follow its height and its line
  const bar = $derived(!!root?.parentElement?.closest('[data-role="toolbar"]'));
  // The tab that is in the tab order: the current one, or the first when none is current
  const focusable = $derived(tabs.some((t) => t.id === current) ? current : tabs[0]?.id);

  // The indexes of the tabs that show, or null when all fit
  let shownIdx = $state<number[] | null>(null);
  $effect(() => {
    const r = root;
    const m = measure;
    if (!r || !m) return;
    void tabs;
    void current;
    const read = () => {
      const avail = r.clientWidth + 0.5;
      const widths = [...m.querySelectorAll<HTMLElement>('.tab:not(.more)')].map(
        (el) => el.getBoundingClientRect().width,
      );
      if (widths.reduce((a, b) => a + b, 0) <= avail) {
        shownIdx = null;
        return;
      }
      const ci = tabs.findIndex((t) => t.id === current);
      const chosen = new Set<number>();
      let sum = m.querySelector<HTMLElement>('.more')?.getBoundingClientRect().width ?? 0;
      if (ci >= 0) {
        chosen.add(ci);
        sum += widths[ci];
      }
      for (let i = 0; i < widths.length; i += 1) {
        if (chosen.has(i)) continue;
        if (sum + widths[i] > avail) break;
        chosen.add(i);
        sum += widths[i];
      }
      shownIdx = [...chosen].sort((a, b) => a - b);
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(r);
    return () => ro.disconnect();
  });
  const split = $derived.by(() => {
    if (!shownIdx) return { shown: tabs, hidden: [] as Tab[] };
    const set = new Set(shownIdx);
    return { shown: tabs.filter((_, i) => set.has(i)), hidden: tabs.filter((_, i) => !set.has(i)) };
  });

  function onkeydown(e: KeyboardEvent) {
    const all = root ? [...root.querySelectorAll<HTMLElement>('a.tab, button.tab')] : [];
    const at = all.indexOf(e.currentTarget as HTMLElement);
    if (at < 0) return;
    let next = -1;
    if (e.key === 'ArrowRight') next = (at + 1) % all.length;
    else if (e.key === 'ArrowLeft') next = (at - 1 + all.length) % all.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = all.length - 1;
    else return;
    e.preventDefault();
    all[next]?.focus();
  }
</script>

{#snippet tab(t: Tab)}
  {#if t.href}
    <a
      class="tab"
      class:on={t.id === current}
      data-h={bar ? 'toolbar' : 'list-item'}
      href={t.href}
      tabindex={t.id === focusable ? 0 : -1}
      aria-current={t.id === current ? 'page' : undefined}
      {onkeydown}
      onclick={() => onselect?.(t.id)}><span class="t">{t.label}</span></a
    >
  {:else}
    <button
      type="button"
      class="tab"
      class:on={t.id === current}
      data-h={bar ? 'toolbar' : 'list-item'}
      tabindex={t.id === focusable ? 0 : -1}
      aria-current={t.id === current ? 'page' : undefined}
      {onkeydown}
      onclick={() => onselect?.(t.id)}><span class="t">{t.label}</span></button
    >
  {/if}
{/snippet}

<nav class="tabs" class:bar aria-label={label} data-role="tabs" bind:this={root}>
  {#each split.shown as t (t.id)}
    {@render tab(t)}
  {/each}
  {#if split.hidden.length}
    <Dropdown align="end" menu>
      {#snippet trigger(toggle, open)}
        <button
          type="button"
          class="tab more"
          data-h={bar ? 'toolbar' : 'list-item'}
          tabindex="-1"
          aria-haspopup="menu"
          aria-expanded={open}
          {onkeydown}
          onclick={toggle}><span class="t">{getMessages().more}</span><Icon name="chevron-down" /></button
        >
      {/snippet}
      {#snippet panel(close)}
        {#each split.hidden as t (t.id)}
          <MenuItem
            href={t.href}
            onclick={() => {
              onselect?.(t.id);
              close();
            }}>{t.label}</MenuItem
          >
        {/each}
      {/snippet}
    </Dropdown>
  {/if}
  <!-- A hidden copy of every tab and of "More", to measure their widths -->
  <span class="measure" aria-hidden="true" data-kata-skip bind:this={measure}>
    {#each tabs as t (t.id)}
      <span class="tab"><span class="t">{t.label}</span></span>
    {/each}
    <span class="tab more"><span class="t">{getMessages().more}</span><Icon name="chevron-down" /></span>
  </span>
</nav>

<style lang="scss">
  @use '../styles/kata' as *;

  // One line; what does not fit folds into the "More" menu
  .tabs {
    position: relative;
    display: flex;
    min-width: 0;
    flex: none;
    border-bottom: bw() solid color(line);
    overflow: clip;
  }
  // Inside a Toolbar: the toolbar draws the line, and the tabs take the rest of its width. They
  // keep their own height (the toolbar's), centred, so the double line of the current tab is whole
  .tabs.bar {
    border-bottom: 0;
    flex: 1 1 auto;
    .tab {
      height: h(toolbar);
    }
  }
  .tab {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: gap(2xs);
    height: h(list-item);
    padding-inline: pad(md);
    border: 0;
    background: none;
    color: color(muted);
    font: inherit;
    @include text(body);
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.12s ease;
    &:hover {
      color: color(text);
      background: color(raise);
      text-decoration: none;
    }
    @include focus-inside;
  }
  // The label is text in a control: trimmed to its ink and centred
  .t {
    display: block;
    min-width: 0;
    @include trim;
  }
  // The current tab: a double line along the bottom, inside the tab
  .on {
    color: color(text);
    box-shadow: inset 0 calc(#{bw()} * -2) 0 color(blue-ink);
  }
  // The copy that is measured: hidden and without a place of its own
  .measure {
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    display: flex;
    visibility: hidden;
    pointer-events: none;
    white-space: nowrap;
  }
</style>
