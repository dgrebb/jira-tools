<script lang="ts">
	import type { Story, Task } from '@types';

	export let story: Story;
	let tasks: Task[] = story.tasks;
</script>

<div class="collapse-arrow border-base-300 bg-base-100 rounded-box collapse my-2 ml-4 border">
	<input type="checkbox" class="peer" />
	<div class="collapse-title text-lg font-medium">
		{story.summary}
	</div>
	<div class="collapse-content">
		<p>{story.description}</p>
		<ul>
			{#each tasks as task}
				<li class="task flex items-start">
					<input type="checkbox" class="task-checkbox mr-2 mt-1" />
					<div>
						<h3 class="task-summary">{task.summary}</h3>
						<p class="task-description">{task.description}</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
