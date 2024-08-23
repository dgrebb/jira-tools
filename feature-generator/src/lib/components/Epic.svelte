<script lang="ts">
	import Story from './Story.svelte';
	import type { Epic } from '@types';

	import * as Collapsible from '$lib/components/ui/collapsible';

	interface Props {
		epic: Epic;
	}

	let { epic }: Props = $props();
</script>

<Collapsible.Root>
	<Collapsible.Trigger>{epic.summary}</Collapsible.Trigger>
	<Collapsible.Content>
		{epic.description}
		{#each epic.stories as story}
			<Story {story} />
		{/each}
	</Collapsible.Content>
</Collapsible.Root>
