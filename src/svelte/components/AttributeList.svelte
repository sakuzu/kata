<script lang="ts" module>
  /** One attribute of an AttributeList */
  export interface AttributeItem {
    key: string;
    value: string;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import { tick } from 'svelte';
  import { getMessages } from '../messages.js';
  import Block from './Block.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import InlineEdit from './InlineEdit.svelte';
  import Kv from './Kv.svelte';
  import LinkAction from './LinkAction.svelte';
  import Text from './Text.svelte';
  import TextInput from './TextInput.svelte';

  // AttributeList: the attributes of a thing, names and values that the user writes. It reaches the
  // edges of its container, as a list does (a flush section, a panel's content). Read only, it is
  // a Kv in a Block. Editable, each row is the name and the value, each changed where it stands
  // (InlineEdit), and a remove button; the rows are a button tall and touch, as list items do. A
  // locked name is shown with a lock and cannot be changed or removed. The add action opens a row of two inputs at the end: Enter or leaving the row adds
  // the attribute, Escape drops it, and a row without a name is dropped.
  //
  // The list shows items; the changes are reported by index into items, and the application
  // updates items (at once), or the row goes back to what items holds. hide leaves out the names
  // the application keeps to itself.
  //
  //   <AttributeList {items} locked={['id']} onchange={(i, item) => …} onadd={(item) => …}
  //     onremove={(i) => …} />
  let {
    items,
    onchange,
    onadd,
    onremove,
    readonly = false,
    locked = [],
    hide,
  }: {
    /** The attributes, in order */
    items: AttributeItem[];
    /** Called with the index and the new name and value of an attribute changed */
    onchange?: (index: number, item: AttributeItem) => void;
    /** Called with an attribute to add; shows the add action */
    onadd?: (item: AttributeItem) => void;
    /** Called with the index of an attribute to remove; shows the remove buttons */
    onremove?: (index: number) => void;
    /** Only read: the list is a Kv */
    readonly?: boolean;
    /** The names shown but not changed or removed */
    locked?: string[];
    /** Leaves out the attributes whose name it returns true for */
    hide?: (key: string) => boolean;
  } = $props();

  // The attributes shown, with their index in items
  const shown = $derived(
    items.map((item, index) => ({ ...item, index })).filter((a) => !hide?.(a.key)),
  );
  // Raised to draw the rows again from items, after a change the application did not take
  let rev = $state(0);
  // The row being added, or null
  let draft = $state<AttributeItem | null>(null);
  let draftRow = $state<HTMLElement>();

  function change(index: number, next: AttributeItem) {
    if (next.key !== '') onchange?.(index, next);
    const now = items[index];
    if (!now || now.key !== next.key || now.value !== next.value) rev += 1;
  }

  async function open() {
    draft = { key: '', value: '' };
    await tick();
    draftRow?.querySelector('input')?.focus();
  }
  function add() {
    if (!draft) return;
    const key = draft.key.trim();
    const value = draft.value.trim();
    draft = null;
    if (key) onadd?.({ key, value });
  }
  function draftKey(e: KeyboardEvent) {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Escape drops the row here and does not reach a panel or a modal around it
      e.stopPropagation();
      draft = null;
    }
  }
  // Leaving the row adds the attribute; moving between its inputs does not
  function draftOut(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && draftRow?.contains(next)) return;
    add();
  }
</script>

<div class="attributes">
  {#if readonly || shown.length === 0}
    {#if shown.length === 0 && !draft}
      <Block><Text muted>{getMessages().noAttributes}</Text></Block>
    {:else if readonly}
      <Block><Kv items={shown.map((a) => ({ k: a.key, v: a.value }))} /></Block>
    {/if}
  {/if}
  {#if !readonly}
    {#each shown as a (`${a.index}:${rev}`)}
      {@const fixed = locked.includes(a.key)}
      {@const editable = !fixed && !!onchange}
      <div class="row">
        <span class="k">
          <InlineEdit
            value={a.key}
            {editable}
            placeholder={getMessages().attributeName}
            label={getMessages().attributeName}
            onCommit={(key) => change(a.index, { key, value: a.value })}
          />
        </span>
        <span class="v">
          <InlineEdit
            value={a.value}
            {editable}
            placeholder={getMessages().addValue}
            label={a.key}
            onCommit={(value) => change(a.index, { key: a.key, value })}
          />
        </span>
        <span class="end">
          {#if fixed}
            <span class="lock" role="img" aria-label={getMessages().locked}>
              <Icon name="lock" tone="muted" />
            </span>
          {:else if onremove}
            <Button
              variant="ghost"
              icon
              aria-label={getMessages().removeAttribute({ key: a.key })}
              onclick={() => onremove?.(a.index)}
            >
              <Icon name="x" />
            </Button>
          {/if}
        </span>
      </div>
    {/each}
    {#if draft}
      <div class="row draft" bind:this={draftRow} onfocusout={draftOut}>
        <span class="k">
          <TextInput
            bind:value={draft.key}
            placeholder={getMessages().attributeName}
            aria-label={getMessages().attributeName}
            onkeydown={draftKey}
          />
        </span>
        <span class="v">
          <TextInput
            bind:value={draft.value}
            placeholder={getMessages().attributeValue}
            aria-label={getMessages().attributeValue}
            onkeydown={draftKey}
          />
        </span>
        <span class="end">
          <!-- Pressing it keeps the focus in the row, so that leaving the row does not add it first -->
          <Button
            variant="ghost"
            icon
            aria-label={getMessages().cancel}
            onmousedown={(e: MouseEvent) => e.preventDefault()}
            onclick={() => (draft = null)}
          >
            <Icon name="x" />
          </Button>
        </span>
      </div>
    {:else if onadd}
      <Block>
        <LinkAction icon="plus" onclick={open}>{getMessages().addAttribute}</LinkAction>
      </Block>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The rows reach the edges, as list items do: each is a button tall, its text in the middle, and
  // they touch. What does not reach the edges (the read list, the empty state, the add action) is
  // in a Block.
  .attributes {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  // One attribute: the name in the column of a Pair's name, the value, and the action at the end.
  // The row owns the padding at its sides: the inset of its container, so what is in it takes
  // none.
  .row {
    display: grid;
    grid-template-columns: 7.5rem minmax(0, 1fr) auto;
    align-items: center;
    column-gap: gap(sm);
    min-width: 0;
    flex: none;
    height: box-h();
    padding-inline: inset();
    > * {
      --kata-inset: 0px;
    }
  }
  .k,
  .v,
  .end {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .k > :global(*),
  .v > :global(*) {
    flex: 1 1 auto;
    min-width: 0;
  }
  // The row of a new attribute holds two inputs of a small button's height
  .draft {
    height: h(button);
    @include scope-box(button-sm);
  }
  .lock {
    display: flex;
  }
  // When the name column does not fit, the name and the action share the first line and the value
  // takes the second
  @include tiny {
    .row {
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas: 'k end' 'v v';
      height: auto;
    }
    .k {
      grid-area: k;
    }
    .v {
      grid-area: v;
    }
    .end {
      grid-area: end;
    }
  }
</style>
