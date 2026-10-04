<script lang="ts">
  import List from '@lucide/svelte/icons/list';
  import Moon from '@lucide/svelte/icons/moon';
  import { Block, Button, Floating, Icon, Row, SearchInput, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let query = $state('');
</script>

<Example>
  <Case label="Pinned to the sides of a frame, gap-md from its edges">
    <div class="frame">
      <Floating top="md" left="md">
        <Block>
          <div class="search">
            <SearchInput bind:value={query} label="Search" placeholder="Search the drawing" />
          </div>
        </Block>
      </Floating>
      <Floating top="md" right="md">
        <Button variant="ghost" icon aria-label="Show the list"><Icon name={List} /></Button>
      </Floating>
      <Floating bottom="md" right="md">
        <Block><Text role="caption" muted>Drawn by the team</Text></Block>
      </Floating>
    </div>
  </Case>
  <Case label="A ghost button alone in a Floating, and a bar of ghost text buttons: the Floating holds their reach">
    <div class="frame short">
      <Floating top="md" left="md">
        <Button variant="ghost" icon aria-label="Switch to dark"><Icon name={Moon} /></Button>
      </Floating>
      <Floating top="md" right="md">
        <Button variant="ghost" aria-expanded="false">Actions</Button>
      </Floating>
      <Floating bottom="md" left="md">
        <Row gap="0">
          <Button variant="ghost">Draw</Button>
          <Button variant="ghost">Measure</Button>
          <Button variant="ghost">Export</Button>
        </Row>
      </Floating>
    </div>
  </Case>
  <Case label="With no side given, it stands in the flow and fills its place">
    <div class="place">
      <Floating>
        <Block><Text>A small panel in a place that is already positioned.</Text></Block>
      </Floating>
    </div>
  </Case>
</Example>

<style>
  /* A positioned frame, as the stage is; its width is what the search measures against */
  .frame {
    position: relative;
    container-type: inline-size;
    height: 16rem;
    overflow: hidden;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  .frame.short {
    height: 10rem;
  }
  /* Two Floatings that would overlap are the application's to place: the search leaves the top
     right corner to the button, the frame less the three gaps, the button and the lines and the
     padding around the search */
  .search {
    width: min(
      15rem,
      calc(
        100cqw - 3 * var(--kata-gap-md) - var(--kata-height-icon-button) -
          4 * var(--kata-border-width) - 2 * var(--kata-pad-md)
      )
    );
  }
  .place {
    display: flex;
    max-width: 22.5rem;
  }
</style>
