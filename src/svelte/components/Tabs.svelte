<script lang="ts">
  import '../styles/components.css';

  // Tabs: switches between views. A tab has the height of a list item with pad-md at the sides; the
  // current tab is underlined with a double line drawn inside it, so its height does not change.
  // Inside a Toolbar the tabs find the toolbar on their own: they take its height, and the
  // underline meets the toolbar's line (the tabs have no line of their own there).
  //
  // A tab with href is a link (it moves to another page, as the tabs of a settings page do); a tab
  // without is a button (it switches a view on the same page). Either way the current tab has
  // aria-current="page". Only the current tab is in the tab order; the left and right arrow keys,
  // Home and End move the focus between the tabs, and Enter or Space opens the focused one. When the
  // tabs do not fit, they scroll sideways and the current tab is kept in view.
  //
  //   <Tabs {tabs} current="general" onselect={(id) => (view = id)} label="Views" />
  //
  // TODO(kata): fold the tabs that do not fit into a "More" Menu at the right end instead of
  // scrolling, once Menu is in kata.
  let {
    tabs,
    current,
    label,
    onselect,
  }: {
    tabs: { id: string; label: string; href?: string }[];
    /** The id of the current tab */
    current: string;
    /** The name of the set of tabs */
    label?: string;
    /** Called with the id of the tab that is opened */
    onselect?: (id: string) => void;
  } = $props();

  let root = $state<HTMLElement>();
  // Inside a Toolbar the tabs follow its height and its line
  const bar = $derived(!!root?.parentElement?.closest('[data-role="toolbar"]'));
  // The tab that is in the tab order: the current one, or the first when none is current
  const focusable = $derived(tabs.some((t) => t.id === current) ? current : tabs[0]?.id);

  function items(): HTMLElement[] {
    return root ? [...root.querySelectorAll<HTMLElement>('.tab')] : [];
  }
  function onkeydown(e: KeyboardEvent) {
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLElement);
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
  // Keep the current tab in view when the tabs scroll
  $effect(() => {
    void current;
    const r = root;
    const el = r?.querySelector<HTMLElement>('.tab.on');
    if (!r || !el) return;
    const left = el.offsetLeft - r.offsetLeft;
    if (left < r.scrollLeft) r.scrollLeft = left;
    else if (left + el.offsetWidth > r.scrollLeft + r.clientWidth)
      r.scrollLeft = left + el.offsetWidth - r.clientWidth;
  });
</script>

<nav class="tabs" class:bar aria-label={label} data-role="tabs" bind:this={root}>
  {#each tabs as t (t.id)}
    {#if t.href}
      <a
        class="tab"
        class:on={t.id === current}
        data-h={bar ? 'toolbar' : 'list-item'}
        href={t.href}
        tabindex={t.id === focusable ? 0 : -1}
        {onkeydown}
        aria-current={t.id === current ? 'page' : undefined}
        onclick={() => onselect?.(t.id)}><span class="t">{t.label}</span></a
      >
    {:else}
      <button
        type="button"
        class="tab"
        class:on={t.id === current}
        data-h={bar ? 'toolbar' : 'list-item'}
        tabindex={t.id === focusable ? 0 : -1}
        {onkeydown}
        aria-current={t.id === current ? 'page' : undefined}
        onclick={() => onselect?.(t.id)}><span class="t">{t.label}</span></button
      >
    {/if}
  {/each}
</nav>

<style lang="scss">
  @use '../styles/kata' as *;

  // One line; what does not fit scrolls sideways without a scroll bar
  .tabs {
    display: flex;
    min-width: 0;
    flex: none;
    border-bottom: bw() solid color(line);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }
  // Inside a Toolbar: the toolbar draws the line, and the tabs take the rest of its width
  .tabs.bar {
    border-bottom: 0;
    flex: 1 1 auto;
    align-self: stretch;
    .tab {
      height: h(toolbar);
    }
  }
  .tab {
    flex: none;
    display: inline-flex;
    align-items: center;
    height: h(list-item);
    padding-inline: pad(md);
    border: 0;
    background: none;
    color: color(muted);
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
</style>
