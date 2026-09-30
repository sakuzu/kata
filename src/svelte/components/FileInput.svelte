<script lang="ts">
  import '../styles/components.css';

  // FileInput: the means to choose files. It has no look of its own and renders one hidden input.
  // What is pressed is the caller's Button: pick(), taken with bind:this, opens the system's file
  // chooser. The chosen files reach onpick as an array of File, and the input is cleared each time,
  // so that the same file can be chosen again.
  //
  //   <Button onclick={() => picker?.pick()}>Choose files</Button>
  //   <FileInput bind:this={picker} accept=".png,.svg" multiple onpick={(files) => add(files)} />
  let {
    accept,
    multiple = false,
    onpick,
    disabled = false,
  }: {
    /** The types it accepts, written as for the accept attribute of an input (any by default) */
    accept?: string;
    /** More than one file */
    multiple?: boolean;
    /** The chosen files; not called when nothing is chosen */
    onpick?: (files: File[]) => void;
    /** pick() opens nothing */
    disabled?: boolean;
  } = $props();

  let el = $state<HTMLInputElement>();

  /** Opens the system's file chooser */
  export function pick() {
    if (!disabled) el?.click();
  }

  function relay(e: Event & { currentTarget: HTMLInputElement }) {
    const input = e.currentTarget;
    const files = [...(input.files ?? [])];
    input.value = '';
    if (files.length > 0) onpick?.(files);
  }
</script>

<input bind:this={el} hidden type="file" {accept} {multiple} {disabled} onchange={relay} />
