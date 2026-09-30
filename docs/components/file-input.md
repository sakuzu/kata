# FileInput

FileInput is the means to choose files, with no look of its own.

## When to use

Place a [Button](button.md) that the person presses, and call `pick()` on
the FileInput, taken with `bind:this`, to open the system's file chooser.
The chosen files reach `onpick`.

```svelte
<Button onclick={() => picker?.pick()}>Choose images</Button>
<FileInput bind:this={picker} accept="image/*" multiple onpick={add} />
```

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `accept` | | The types it accepts, as the `accept` of an input |
| `multiple` | `false` | More than one file |
| `onpick` | | Called with the chosen files as an array |
| `disabled` | `false` | `pick()` opens nothing |

## Contract

It renders one hidden file input. `onpick` is not called when nothing is
chosen, and the input is cleared after each choice, so that the same file
can be chosen again.

## Example

[FileInput](../../examples/file-input/)
