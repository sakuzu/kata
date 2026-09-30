<script lang="ts">
  import { Prose } from '@sakuzu/kata/svelte';
  import Example from '../_shared/Example.svelte';

  const picture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 120'%3E%3Crect width='320' height='120' fill='%23204ec3'/%3E%3Ccircle cx='60' cy='60' r='30' fill='%23f8cd09'/%3E%3C/svg%3E";
</script>

<Example>
  <Prose>
    <h1>Getting started</h1>
    <p>
      This page shows how <a href="#shapes">shapes</a> are drawn and edited. Paragraphs are apart by
      pad-lg, and a heading is closer to the text it introduces than to the text before it.
    </p>
    <h2 id="shapes">Drawing shapes</h2>
    <p>Choose a tool, then click where the shape starts. Press <code>Esc</code> to stop.</p>
    <ul>
      <li>A point is one click.</li>
      <li>A polyline ends with a double click.</li>
      <li>A polygon closes on its first vertex.</li>
    </ul>
    <h3>Keyboard</h3>
    <ol>
      <li>Select a shape.</li>
      <li>Move it with the arrow keys.</li>
    </ol>
    <h4>Shortcuts</h4>
    <dl>
      <dt>Undo</dt>
      <dd>Takes back the last change.</dd>
      <dt>Redo</dt>
      <dd>Applies it again.</dd>
    </dl>
    <pre><code>editor.select('shape-1');</code></pre>
    <blockquote>A quotation is set off by a line on its left.</blockquote>
    <figure>
      <img src={picture} alt="A yellow circle on blue" />
      <figcaption>A figure with its caption.</figcaption>
    </figure>
    <table>
      <thead><tr><th>Tool</th><th>Key</th></tr></thead>
      <tbody>
        <tr><td>Point</td><td>P</td></tr>
        <tr><td>Polyline</td><td>L</td></tr>
      </tbody>
    </table>
    <details>
      <summary>More options</summary>
      <p>A folded part opens when its summary is pressed.</p>
    </details>
  </Prose>
</Example>
