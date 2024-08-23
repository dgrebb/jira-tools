<script lang="ts">
	import Story from './Story.svelte';
	import type { Epic } from '@types';

	interface Props {
		epic: Epic;
	}

	let { epic }: Props = $props();
</script>

<div class="collapse-arrow border-base-300 bg-base-100 rounded-box collapse my-2 border">
	<input type="checkbox" class="peer" />
	<div class="collapse-title text-xl font-medium">
		{epic.summary}
	</div>
	<div class="collapse-content">
		<p>{epic.description}</p>
		{#each epic.stories as story (story.id)}
			<Story {story} />
		{/each}
	</div>
</div>
