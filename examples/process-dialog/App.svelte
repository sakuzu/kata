<script lang="ts">
  import {
    Button,
    Field,
    NumberInput,
    ProcessDialog,
    Row,
    TextInput,
    Toggle,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(false);
  let running = $state(false);
  let progress = $state(0);
  let tolerance = $state(2);
  let name = $state('Outline, simplified');
  let keep = $state(true);
  let timer: ReturnType<typeof setInterval> | undefined;

  function run() {
    running = true;
    progress = 0;
    timer = setInterval(() => {
      progress += 20;
      if (progress < 100) return;
      clearInterval(timer);
      running = false;
      open = false;
    }, 300);
  }
  function stop() {
    clearInterval(timer);
    running = false;
  }
</script>

<Example>
  <Case label="A process over the page: run it, or cancel it while it runs">
    <Row><Button onclick={() => (open = true)}>Simplify…</Button></Row>
    <ProcessDialog
      bind:open
      title="Simplify"
      description="Removes the points that change the outline little."
      runLabel="Simplify"
      {running}
      {progress}
      runningText="Simplifying 3 shapes"
      onrun={run}
      oncancel={stop}
    >
      <Field label="Tolerance" for="process-tolerance" note="Larger values remove more points.">
        <NumberInput id="process-tolerance" bind:value={tolerance} min={0} unit="px" />
      </Field>
    </ProcessDialog>
  </Case>
  <Case label="The fields in order: description, then the fields gap-lg apart">
    <ProcessDialog
      inline
      title="Combine"
      description="Makes one shape of the 3 shapes selected."
      runLabel="Combine"
    >
      <Field label="Name of the result" for="process-name">
        <TextInput id="process-name" bind:value={name} />
      </Field>
      <Toggle bind:checked={keep} label="Keep the originals" />
    </ProcessDialog>
  </Case>
  <Case label="After a failed run: the error first; the run action disabled">
    <ProcessDialog
      inline
      title="Combine"
      error="The shapes do not overlap, so they cannot be combined."
      description="Makes one shape of the 3 shapes selected."
      runLabel="Combine"
      disabled
    />
  </Case>
  <Case label="Running: the progress replaces the body">
    <ProcessDialog inline title="Export" running progress={40} runningText="Exporting page 2 of 5" />
  </Case>
</Example>
