<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Tile: the mark of a thing (a team, a project): an icon, or one or two initials, centred in a
  // square as tall as a badge (marks have one height). The surface is raise-2 and the text is a
  // glyph. A person is an Avatar (round); a picture of a document is a Thumbnail. Inside a list
  // item it keeps md above and below.
  //
  //   <ListItem columns="auto minmax(0, 1fr)" plain><Tile>T</Tile><span>Team</span></ListItem>
  //   <Tile><Icon name={Folder} /></Tile>
  let { children }: { children: Snippet } = $props();
</script>

<span class="tile" data-role="mark" data-h="badge">{@render children()}</span>

<style lang="scss">
  @use '../styles/kata' as *;

  .tile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(badge);
    height: h(badge);
    background: color(raise-2);
    @include text(glyph);
    // Text, not muted: muted on raise-2 falls below 7:1
    color: color(text);
    font-weight: 600;
    flex: none;
  }
</style>
