# ToastHost

ToastHost shows the toasts of the toast store.

## When to use

Place one at the root of the application, then call the store from
anywhere.

```ts
import { toast } from '@sakuzu/kata/svelte';

toast.show('Saved');
toast.error('The file could not be read');
```

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `inline` | `false` | In the flow of the page, for documentation |

## The store

| Member | Description |
| --- | --- |
| `toast.show(msg, kind?)` | Shows a message, of kind `info` by default |
| `toast.error(msg)` | Shows a failure |
| `toast.dismiss(id)` | Removes a toast before its time |
| `toast.items` | The toasts on screen, oldest first |
| `TOAST_DURATION` | How long a toast stays, 3200ms |

`show` and `error` return the id of the new toast.

## Contract

The toasts stack at the bottom right of the screen, gap-md from its
edges, the newest at the bottom, at most three, gap-sm apart, on the
toast layer; each has a close button named by the `close` string. An
error is a [Toast](toast.md) with a red line, anything else a neutral
one. Each toast goes after `TOAST_DURATION`. The host is announced
politely (`aria-live`), and draws nothing while the store is empty.

## Example

[ToastHost](../../examples/toast-host/)
