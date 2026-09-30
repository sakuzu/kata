<script lang="ts">
  import '../styles/components.css';

  // MenuDivider: the line between groups of items in a menu. It has no space above or below, so the
  // hover surface of the items meets the line; the padding of the items is the distance. A
  // destructive item goes after it.
  //
  //   <MenuDivider />
</script>

<div class="sep" data-role="rule" role="separator"></div>

<style lang="scss">
  @use '../styles/kata' as *;

  .sep {
    height: bw();
    background: color(line);
    flex: none;
  }
</style>
