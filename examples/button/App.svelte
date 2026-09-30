<script lang="ts">
  import Bell from '@lucide/svelte/icons/bell';
  import Download from '@lucide/svelte/icons/download';
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import Undo from '@lucide/svelte/icons/undo-2';
  import { Block, Button, Icon, Row, Swatch } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Variants">
    <Row wrap>
      <Button variant="primary">Save</Button>
      <Button>Duplicate</Button>
      <Button variant="danger">Delete…</Button>
      <Button variant="danger-fill">Delete</Button>
      <Button variant="ghost" icon aria-label="More"><Icon name={Ellipsis} /></Button>
    </Row>
  </Case>
  <Case label="Disabled and busy">
    <Row wrap>
      <Button disabled>Duplicate</Button>
      <Button variant="primary" disabled>Save</Button>
      <Button busy>Saving</Button>
    </Row>
  </Case>
  <Case label="Icons, a key hint and a value">
    <Row wrap>
      <Button leading={Download}>Export</Button>
      <Button trailing="chevron-down">Sort</Button>
      <Button kbd="⌘⏎">Send</Button>
      <Button trailing="chevron-down" clamp mono>
        {#snippet mark()}<Swatch color="#2d7ff9" />{/snippet}#2D7FF9
      </Button>
    </Row>
  </Case>
  <Case label="Icon buttons: selected, and with a count">
    <Row gap="0">
      <Button variant="ghost" icon aria-label="Close"><Icon name="x" /></Button>
      <Button variant="ghost" icon on aria-label="Pen"><Icon name="pencil" /></Button>
      <Button variant="ghost" icon badge={3} aria-label="Notifications"><Icon name={Bell} /></Button>
      <Button variant="ghost" icon badge={120} aria-label="Messages"><Icon name={Bell} /></Button>
    </Row>
  </Case>
  <Case label="Tooltips: the name of an icon button with its key, and a text button with tip">
    <Row gap="0">
      <Button variant="ghost" icon aria-label="Undo" shortcut="⌘Z"><Icon name={Undo} /></Button>
      <Button variant="ghost" icon aria-label="Edit" shortcut="E"><Icon name="pencil" /></Button>
      <Button variant="ghost" icon tip={false} aria-label="Close"><Icon name="x" /></Button>
    </Row>
    <Row><Button tip="Save a copy as a file">Export</Button></Row>
  </Case>
  <Case label="The small button, declared by the container">
    <Small>
      <Row wrap>
        <Button>Rename</Button>
        <Button variant="primary">Share</Button>
        <Button variant="ghost" icon aria-label="Add"><Icon name="plus" /></Button>
      </Row>
    </Small>
  </Case>
  <Case label="A link that looks like a button">
    <Row><Button href="#top">Open the help</Button></Row>
  </Case>
  <Case label="block: the primary action of a one-column form">
    <Surface width="22.5rem">
      <Block>
        <Button variant="primary" block>Create the account</Button>
      </Block>
    </Surface>
  </Case>
  <Case label="A long text in a narrow container ends with an ellipsis">
    <Surface width="12rem">
      <Block>
        <Row><Button>A long name for an action that does not fit</Button></Row>
      </Block>
    </Surface>
  </Case>
</Example>
