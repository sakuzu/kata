<script lang="ts">
  import '../styles/components.css';
  import { getMessages } from '../messages.js';
  import Avatar from './Avatar.svelte';
  import Badge from './Badge.svelte';
  import Block from './Block.svelte';
  import Dropdown from './Dropdown.svelte';
  import List from './List.svelte';
  import ListItem from './ListItem.svelte';
  import SearchInput from './SearchInput.svelte';
  import Stack from './Stack.svelte';
  import State from './State.svelte';
  import Text from './Text.svelte';

  // Presence: the people who are here now, as overlapping avatars. The avatars (the square of a
  // small button) overlap by gap-xs and are parted by a ring of two lines in the panel color; the
  // overlap comes from grid columns narrower than an avatar, not from a negative margin. The
  // people after max gather at the end as "+n", so that many people never widen it; "+n" is a
  // button that opens the roster. The avatar under the pointer comes to the front.
  //
  // A person's color is the surface of their avatar (avatars have none of their own); without
  // one it is the fill surface. Colors are data, so their contrast is the application's.
  //
  // roster renders the list of everyone instead (name, "(you)" and role), without a container of
  // its own, for a menu or a panel that holds it. With more than eight people it has a search.
  //
  //   <Presence users={[{ name: 'Sam', you: true }, { name: 'Kim', color: '#6f86e6', role: 'view' }]} />
  //   <Presence {users} roster />
  type User = {
    /** A unique key; without it the position in the list */
    id?: string;
    name: string;
    /** The surface of the avatar */
    color?: string;
    role?: 'edit' | 'view';
    /** The person looking at the screen */
    you?: boolean;
  };
  let {
    users,
    max = 3,
    roster = false,
  }: {
    users: User[];
    /** How many avatars show before "+n" (default 3) */
    max?: number;
    /** Render the roster only */
    roster?: boolean;
  } = $props();

  const shown = $derived(users.slice(0, max));
  const rest = $derived(Math.max(0, users.length - max));
  let query = $state('');
  const listed = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return q ? users.filter((u) => u.name.toLowerCase().includes(q)) : users;
  });
  // One character (a CJK name) or two (a Latin one); an emoji is not split
  function initial(name: string): string {
    const first = [...name][0] ?? '?';
    return /[A-Za-z]/.test(first) ? name.slice(0, 2).toUpperCase() : first;
  }
</script>

{#snippet rosterBody()}
  <!-- The content of a container without padding: the text and the search in a Block, the list
       edge to edge -->
  <Stack gap={0}>
    <Block>
      <Stack gap="sm">
        <Text role="caption">{getMessages().participants({ count: users.length })}</Text>
        {#if users.length > 8}
          <SearchInput
            bind:value={query}
            placeholder={getMessages().searchByName}
            label={getMessages().searchParticipants}
          />
        {/if}
      </Stack>
    </Block>
    {#if listed.length === 0}
      <Block><State text={getMessages().noParticipants} /></Block>
    {:else}
      <div class="list">
        <List label={getMessages().participants({ count: users.length })}>
          {#each listed as u, i (u.id ?? i)}
            <ListItem columns="auto minmax(0, 1fr) auto" plain rule>
              <span class="tone" style:--kata-color-fill={u.color} data-kata-datacolor>
                <Avatar initial={initial(u.name)} in />
              </span>
              <Text role="body" clamp
                >{u.name}{#if u.you}{' '}<span class="me">{getMessages().you}</span>{/if}</Text
              >
              {#if u.role}
                <Badge tone={u.role === 'edit' ? 'blue' : 'faint'}
                  >{u.role === 'edit' ? getMessages().roleEditor : getMessages().roleViewer}</Badge
                >
              {/if}
            </ListItem>
          {/each}
        </List>
      </div>
    {/if}
  </Stack>
{/snippet}

{#if roster}
  {@render rosterBody()}
{:else}
  <span
    class="presence"
    data-role="presence"
    role="group"
    aria-label={getMessages().participants({ count: users.length })}
  >
    {#each shown as u, i (u.id ?? i)}
      <span class="slot" title={u.name} style:--kata-color-fill={u.color} data-kata-datacolor>
        <Avatar initial={initial(u.name)} />
      </span>
    {/each}
    {#if rest > 0}
      <span class="slot">
        <Dropdown align="end" bare>
          {#snippet trigger(toggle, open)}
            <button
              class="more"
              type="button"
              onclick={toggle}
              aria-haspopup="true"
              aria-expanded={open}
              aria-label={getMessages().showMore({ count: rest })}
            >
              <Avatar initial={`+${rest}`} />
            </button>
          {/snippet}
          {#snippet panel()}
            <div class="roster" data-role="menu">{@render rosterBody()}</div>
          {/snippet}
        </Dropdown>
      </span>
    {/if}
  </span>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  // The columns are gap-xs narrower than an avatar, so the avatars overlap; the padding at the
  // right holds what the last one reaches past its column
  .presence {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: calc(#{h(button-sm)} - #{gap(xs)});
    align-items: center;
    padding-inline-end: pad(xs);
    flex: none;
  }
  // Only passes the color on to the avatar of the roster
  .tone {
    display: contents;
  }
  // The ring in the surface color looks cut out of the surface; later people come on top
  .slot {
    display: inline-flex;
    flex: none;
    position: relative;
    border-radius: 50%;
    box-shadow: 0 0 0 calc(#{bw()} * 2) color(surface);
  }
  .slot:hover {
    z-index: 1;
  }
  // "+n": a button without a line that looks like an avatar
  .more {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: none;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }
  // The roster opened from "+n": a container without padding, the width of a popover, with the
  // panel surface and a strong line
  .roster {
    width: var(--kata-width-popover);
    @include bundle;
    @include surface(panel);
    border: bw() solid color(line-strong);
  }
  // Eight list items show; more scroll
  .list {
    max-height: calc(#{h(list-item)} * 8);
    overflow-y: auto;
  }
  .me {
    color: color(muted);
  }
</style>
