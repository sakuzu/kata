<script lang="ts">
  import Upload from '@lucide/svelte/icons/upload';
  import { Button, DropTarget, Icon, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let over = $state(false);
</script>

<Example>
  <Case label="Drag a file over it: the line turns blue and the surface raise">
    <div
      role="region"
      aria-label="Drop files"
      ondragover={(e) => {
        e.preventDefault();
        over = true;
      }}
      ondragleave={() => (over = false)}
      ondrop={(e) => {
        e.preventDefault();
        over = false;
      }}
    >
      <DropTarget {over}>
        <Icon name={Upload} />
        <Text as="span">Drop files here</Text>
        <Button>Choose files</Button>
      </DropTarget>
    </div>
  </Case>
  <Case label="over">
    <DropTarget over>
      <Icon name={Upload} />
      <Text as="span">Release to add the files</Text>
    </DropTarget>
  </Case>
</Example>
