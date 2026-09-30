<script lang="ts">
  import { Block, Button, InputGroup, TextInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="An input and its action">
    <Surface width="28rem">
      <Block>
        <InputGroup>
          <TextInput value="https://example.com/image.png" aria-label="Address" />
          {#snippet action()}<Button>Load</Button>{/snippet}
        </InputGroup>
      </Block>
    </Surface>
  </Case>
  <Case label="Two actions; they move below when the width is short">
    <Surface width="16rem">
      <Block>
        <InputGroup>
          <TextInput value="team-invite-4f9a" mono readonly aria-label="Invitation" />
          {#snippet action()}<Button>Copy</Button><Button variant="primary">Send</Button>{/snippet}
        </InputGroup>
      </Block>
    </Surface>
  </Case>
</Example>
