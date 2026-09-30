<script lang="ts">
  import { Block, Button, Row, Swatch, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="The shapes">
    <Row gap="md" wrap>
      <Row gap="2xs"><Swatch color="#2D7FF9" /><Text role="caption">box</Text></Row>
      <Row gap="2xs"><Swatch shape="dot" color="#E5484D" /><Text role="caption">dot</Text></Row>
      <Row gap="2xs"><Swatch shape="line" color="#2E9E5B" /><Text role="caption">line</Text></Row>
      <Row gap="2xs"><Swatch shape="area" color="#C29210" /><Text role="caption">area</Text></Row>
      <Row gap="2xs"><Swatch shape="icon" icon="polyline" color="#8A5CF6" /><Text role="caption">icon</Text></Row>
      <Row gap="2xs">
        <Swatch shape="ramp" color="linear-gradient(to right, #fff5eb, #d9730d, #7f2704)" /><Text role="caption">ramp</Text>
      </Row>
    </Row>
  </Case>
  <Case label="A pale colour keeps its edge">
    <Row><Swatch color="#FFFFFF" /><Swatch shape="icon" icon="polygon" color="#FFF5B0" /></Row>
  </Case>
  <Case label="A ramp at the width of its container">
    <Surface width="15rem">
      <Block>
        <Swatch shape="ramp" fill color="linear-gradient(to right, #eff3ff, #2d7ff9, #08306b)" />
      </Block>
    </Surface>
  </Case>
  <Case label="A swatch that is pressed is inside an icon button">
    <Row gap="0"><Button variant="ghost" icon aria-label="Fill color"><Swatch color="#E5484D" /></Button></Row>
  </Case>
</Example>
