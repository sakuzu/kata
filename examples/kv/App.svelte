<script lang="ts">
  import { Block, Kv } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="A column of read pairs: the names line up">
    <Surface width="28rem">
      <Block>
        <Kv
          items={[
            { k: 'Length', v: '13.1 km' },
            { k: 'Points', v: '482' },
            { k: 'Created by', v: 'Sam Lee' },
            { k: 'ID', v: '3f2a9c0e-7b41-4d8e-9a55-0c1d2e3f4a5b', mono: true, clamp: true },
            { k: 'Owner', v: 'Not set', muted: true },
            { k: 'Source', v: 'Survey 2026', note: 'Updated every month' },
          ]}
        />
      </Block>
    </Surface>
  </Case>
  <Case label="A tree of values: indent">
    <Surface width="28rem">
      <Block>
        <Kv
          items={[
            { k: 'style', v: '' },
            { k: 'stroke', v: '#2d7ff9', indent: 1, mono: true },
            { k: 'width', v: '2', indent: 1 },
            { k: 'dash', v: '4 2', indent: 2 },
          ]}
        />
      </Block>
    </Surface>
  </Case>
  <Case label="tight: the name column takes the width of the longest name">
    <Surface width="16rem">
      <Block>
        <Kv
          tight
          items={[
            { k: 'Size', v: '1.2 MB' },
            { k: 'Rows', v: '3,204' },
          ]}
        />
      </Block>
    </Surface>
  </Case>
</Example>
