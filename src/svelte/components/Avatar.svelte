<script lang="ts">
  import '../styles/components.css';

  // Avatar: the round mark of a person, with their initials. Alone it is the square of a small
  // button; `in` is the small one inside a list item or a toolbar, as tall as a badge (marks have
  // one height). It has no colour of its own and no picture; the initials are trimmed to their ink
  // and centred. A thing that is not a person is a Tile or a Thumbnail.
  //
  //   <Avatar initial="SA" />   <Avatar initial="SA" in />
  let {
    initial,
    in: inline = false,
  }: {
    /** One or two characters */
    initial: string;
    /** The small size, inside a list item or a toolbar */
    in?: boolean;
  } = $props();
</script>

<span class="avatar" class:in={inline} data-role="mark" data-h={inline ? 'badge' : 'button-sm'}
  ><span class="t">{initial}</span></span
>

<style lang="scss">
  @use '../styles/kata' as *;

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: h(button-sm);
    height: h(button-sm);
    border-radius: 50%;
    // Avatars overlap, so the surface is opaque
    background: color(fill);
    @include text(caption);
    color: color(text);
    font-weight: 600;
    flex: none;
  }
  .t {
    display: block;
    @include trim;
  }
  .in {
    width: h(badge);
    height: h(badge);
    @include text(glyph);
    color: color(text);
  }
</style>
