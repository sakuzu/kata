<script lang="ts">
  import { Presence, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const people = [
    { id: '1', name: 'Sam Lee', you: true, role: 'edit' as const },
    { id: '2', name: 'Kim', color: '#6f86e6', role: 'edit' as const },
    { id: '3', name: '山口 千夏', color: '#3f9e6f', role: 'view' as const },
    { id: '4', name: 'ito', role: 'view' as const },
    { id: '5', name: 'Emma Clarke', role: 'view' as const },
  ];
  const many = Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    name: ['Ann', 'Ben', 'Cy', 'Dee', 'Eve', 'Fay', 'Gus', 'Hal', 'Ivy', 'Jo', 'Kai', 'Lu'][i],
    role: 'view' as const,
  }));
</script>

<Example>
  <Case label="Three people, and five with max 3 (+2)">
    <Row gap="lg" wrap>
      <Presence users={people.slice(0, 3)} />
      <Presence users={people} max={3} />
    </Row>
  </Case>
  <Case label="The roster, in a container that holds it">
    <Surface width="18rem"><Presence users={people} roster /></Surface>
  </Case>
  <Case label="A roster of more than eight people has a search">
    <Surface width="18rem"><Presence users={many} roster /></Surface>
  </Case>
</Example>
