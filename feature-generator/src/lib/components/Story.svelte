<script lang="ts">
	import type { Story, Task } from '@types';
	import * as Collapsible from '$lib/components/ui/collapsible';

	export let story: Story;
	let tasks: Task[] = story.tasks;
</script>

<Collapsible.Root>
	<Collapsible.Trigger>{story.summary}</Collapsible.Trigger>
	<Collapsible.Content>
		{story.description}
		{#each tasks as task}
			<li class="task flex items-start">
				<div>
					<h3 class="task-summary">{task.summary}</h3>
					<p class="task-description">{task.description}</p>
				</div>
			</li>
		{/each}
	</Collapsible.Content>
</Collapsible.Root>
