// @sakuzu/kata/svelte: the components of kata for Svelte 5. They need the foundation's tokens and
// base CSS, which the application imports once (`import '@sakuzu/kata'`). Each component imports
// the rules they share (styles/components.css) itself.

export {
  type IconComponent,
  type IconName,
  type IconSource,
  iconComponent,
  icons,
} from './icons.js';
export { defaultMessages, getMessages, type Messages, setMessages } from './messages.js';
