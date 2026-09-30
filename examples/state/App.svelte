<script lang="ts">
  import { Block, Button, Grid, State } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Empty, with a note and an action">
    <Surface width="28rem">
      <Block>
        <State text="Nothing is here yet." note="Drop a file here, or choose one from the library.">
          {#snippet actions()}<Button>Choose a file</Button>{/snippet}
        </State>
      </Block>
    </Surface>
  </Case>
  <Case label="Loading, and failed">
    <Grid cols={2}>
      <Surface><Block><State loading text="Loading" /></Block></Surface>
      <Surface>
        <Block>
          <State tone="error" text="It could not be loaded." note="Check the connection.">
            {#snippet actions()}<Button>Try again</Button>{/snippet}
          </State>
        </Block>
      </Surface>
    </Grid>
  </Case>
</Example>
