<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { tick } from 'svelte';
  import { createNarrow } from '../lib/viewport.svelte.js';
  import { getMessages } from '../messages.js';
  import Actions from './Actions.svelte';
  import Button from './Button.svelte';
  import Footer from './Footer.svelte';
  import Icon from './Icon.svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';

  // Modal: a container laid over the screen. From top to bottom: the head (the title and the close
  // button, with a line below), an optional band for steps (sub), the body and the Footer. Only the
  // body shrinks and scrolls. The body has pad-md inside and stacks its children gap-md apart; flush
  // drops the padding, for content that reaches the edges and holds its own. The Footer fixes the
  // order of the actions, so the caller only fills its slots.
  //
  // Below 48rem it fills the screen and the Footer's actions move into the head: the close button
  // (or back, with onback) at the start and the primary action (or the status) at the end; the
  // secondary action and the status move to Actions at the end of the body. A confirmation stays a
  // small dialog in the centre.
  //
  // Opening and closing, Escape, the scrim, the first focus and the ARIA attributes are fixed. It is
  // a <dialog> opened with showModal(): the focus stays inside and the page behind is inert.
  //
  // inline draws the same surface in the flow of a page, without a scrim, a <dialog> or a change of
  // size, for documentation.
  //
  //   <Modal bind:open title="New document">
  //     <Field …>…</Field>
  //     {#snippet cancel()}<Button onclick={() => (open = false)}>Cancel</Button>{/snippet}
  //     {#snippet primary()}<Button variant="primary" onclick={create}>Create</Button>{/snippet}
  //   </Modal>
  let {
    open = $bindable(false),
    title,
    size = 'md',
    confirm = false,
    persistent = false,
    flush = false,
    inline = false,
    onclose,
    onback,
    children,
    sub,
    lead,
    secondary,
    cancel,
    primary,
    status,
  }: {
    open?: boolean;
    title: string;
    /** The width: sm 25rem, md 35rem, lg 45rem or xl 60rem. A confirmation is sm */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** A confirmation: the scrim does not close it and it never fills the screen */
    confirm?: boolean;
    /** Cannot be closed: no close button, and neither Escape nor the scrim closes it */
    persistent?: boolean;
    /** The body reaches the edges; the content holds its own padding */
    flush?: boolean;
    /** The same surface in the flow of a page, for documentation (open is ignored) */
    inline?: boolean;
    /** Called once when the modal closes, however it closes */
    onclose?: () => void;
    /** On a full screen, the start of the head is back instead of close and calls this */
    onback?: () => void;
    children: Snippet;
    /** A band under the head, for steps; it does not scroll with the body */
    sub?: Snippet;
    /** The left end of the Footer: a status or a third outcome */
    lead?: Snippet;
    secondary?: Snippet;
    cancel?: Snippet;
    primary?: Snippet;
    /** The status of a modal that saves as it goes, at the left end of the Footer */
    status?: string;
  } = $props();

  let dialog = $state<HTMLDialogElement>();
  const titleId = $props.id();

  const narrow = createNarrow(48);
  $effect(narrow.start);
  const full = $derived(narrow.current && !confirm && !inline);

  const hasFoot = $derived(!!(lead || status || secondary || cancel || primary));
  // On a full screen with back, the secondary action is back itself; it does not show again
  const bodySecondary = $derived(full && onback ? undefined : secondary);
  // On a full screen the primary action takes the end of the head, so the status moves to the body
  const hasBodyActions = $derived(!!(lead || (status && primary) || bodySecondary));

  $effect(() => {
    const d = dialog;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  });

  // The first focus: cancel in a confirmation; otherwise the first input of the body, else the
  // primary action. showModal() would focus the close button of the head, so the focus is moved
  // after opening.
  $effect(() => {
    if (!open) return;
    const d = dialog;
    if (!d) return;
    tick().then(() => {
      const seats = [
        ...d.querySelectorAll<HTMLElement>(
          '[data-role="footer"] button, [data-role="footer"] a[href]',
        ),
      ];
      const target = confirm
        ? seats[0]
        : (d.querySelector<HTMLElement>(
            '.body input:not([type="hidden"]), .body textarea, .body select',
          ) ??
          seats[seats.length - 1] ??
          d.querySelector<HTMLElement>('.head .end button'));
      target?.focus();
    });
  });

  // The close button and the scrim only ask to close. The modal closes on the dialog's close event,
  // the one place that calls onclose; Escape and open = false take the same path.
  function requestClose() {
    open = false;
  }

  function onDialogClose() {
    open = false;
    onclose?.();
  }
</script>

{#snippet statusLead()}<Text role="caption">{status}</Text>{/snippet}

{#snippet closeButton()}
  <Button variant="ghost" icon aria-label={getMessages().close} onclick={requestClose}>
    <Icon name="x" />
  </Button>
{/snippet}

{#snippet backButton()}
  <Button variant="ghost" icon aria-label={getMessages().back} onclick={() => onback?.()}>
    <Icon name="arrow-left" />
  </Button>
{/snippet}

<!-- TODO(kata): the head is the Toolbar of the structure family once it is published -->
{#snippet head(start: Snippet | undefined, end: Snippet | undefined, tail: boolean)}
  <div class="head" class:tail data-role="toolbar" data-h="toolbar">
    {@render start?.()}
    <h2 class="title" id={titleId}>{title}</h2>
    {#if end}<div class="end">{@render end()}</div>{/if}
  </div>
{/snippet}

{#snippet fullStart()}
  {#if onback}{@render backButton()}{:else if !persistent}{@render closeButton()}{/if}
{/snippet}
{#snippet fullEnd()}
  {#if primary}{@render primary()}{:else if status}{@render statusLead()}{/if}
{/snippet}

{#snippet surface()}
  {#if full}
    {@render head(fullStart, primary || status ? fullEnd : undefined, !primary)}
  {:else if persistent}
    {@render head(undefined, undefined, false)}
  {:else}
    {@render head(undefined, closeButton, true)}
  {/if}
  {#if sub}
    <div class="sub">{@render sub()}</div>
  {/if}
  <div class="body" data-inset={flush ? undefined : true} class:flush>
    {#if flush}
      {@render children()}
    {:else}
      <Stack gap="md">
        {@render children()}
        {#if full && hasBodyActions}
          <Actions
            lead={lead ?? (status && primary ? statusLead : undefined)}
            secondary={bodySecondary}
          />
        {/if}
      </Stack>
    {/if}
  </div>
  {#if !full && hasFoot}
    <Footer lead={lead ?? (status ? statusLead : undefined)} {secondary} {cancel} {primary} />
  {/if}
{/snippet}

{#if inline}
  <div
    class="modal {size}"
    class:confirm
    data-role="modal"
    data-inline
    aria-labelledby={titleId}
    role={confirm ? 'alertdialog' : 'dialog'}
  >
    {@render surface()}
  </div>
{:else}
  <dialog
    bind:this={dialog}
    class="modal {size}"
    class:confirm
    class:full
    data-role="modal"
    aria-labelledby={titleId}
    aria-modal="true"
    role={confirm ? 'alertdialog' : 'dialog'}
    onclose={onDialogClose}
    oncancel={(e) => persistent && e.preventDefault()}
    onclick={(e) => e.target === dialog && !confirm && !persistent && requestClose()}
  >
    {@render surface()}
  </dialog>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // The user agent's spacing, size limits and backdrop of <dialog> are replaced here. The modal is
  // gap-lg from the edges of the screen.
  .modal {
    margin: auto;
    padding: 0;
    max-width: none;
    max-height: calc(100% - #{gap(lg)} * 2);
    color: color(text);
    background: color(panel);
    border: bw() solid color(line-strong);
    display: flex;
    flex-direction: column;
    width: min(var(--kata-modal-width), 100% - #{gap(lg)} * 2);
    @include scope-box(button);
    &:not([open]):not([data-inline]) {
      display: none;
    }
    &::backdrop {
      background: color(scrim);
    }
  }
  .sm {
    --kata-modal-width: var(--kata-width-modal-sm);
  }
  .md {
    --kata-modal-width: var(--kata-width-modal-md);
  }
  .lg {
    --kata-modal-width: var(--kata-width-modal-lg);
  }
  .xl {
    --kata-modal-width: var(--kata-width-modal-xl);
  }
  // A confirmation is sm and stays in the centre, gap-md from the edges
  .modal.confirm {
    width: min(var(--kata-width-modal-sm), 100% - #{gap(md)} * 2);
  }
  .modal.full {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border: 0;
  }
  // In the flow of a page the height follows the content and the width stops at the container
  .modal[data-inline] {
    margin: 0;
    max-height: none;
    width: min(var(--kata-modal-width), 100%);
  }
  // The head: the height of a toolbar, pad-md at the sides (pad-sm after an icon button at the
  // end), small buttons inside, a line below. The title is h2 on one line.
  .head {
    display: flex;
    align-items: center;
    gap: gap(sm);
    height: h(toolbar);
    padding-inline: pad(md);
    flex: none;
    min-width: 0;
    border-bottom: bw() solid color(line);
    @include text(body);
    @include scope-box(button-sm);
  }
  .tail {
    padding-inline-end: pad(sm);
  }
  .title {
    flex: 1;
    @include text(h2);
    margin: 0;
    @include trim;
    @include ellipsis;
  }
  .end {
    display: flex;
    align-items: center;
    gap: 0;
    margin-left: auto;
    flex: none;
  }
  // The band for steps: pad-sm above and below, pad-md at the sides
  .sub {
    padding: pad(sm) pad(md);
    border-bottom: bw() solid color(line);
    flex: none;
  }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    > :global(*) {
      flex: none;
    }
  }
  .body:not(.flush) {
    @include container;
  }
  .body.flush {
    @include bundle;
  }
</style>
