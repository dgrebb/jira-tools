<script lang="ts">
	import type { Story, Task } from '@types';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Card } from './ui/card';

	export let story: Story;
	let tasks: Task[] = story.tasks;
</script>

<Collapsible.Root>
	<Card class="features mt-8">
		<Collapsible.Trigger
			><h3 class="task-summary scroll-m-20 text-2xl font-semibold tracking-tight">
				{story.summary}
			</h3></Collapsible.Trigger
		>
		<Collapsible.Content>
			{story.description}
			{#each tasks as task}
				<li class="task flex items-start">
					<div>
						<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
							{task.summary}
						</h4>
						<p class="task-description">{task.description}</p>
					</div>
				</li>
			{/each}
		</Collapsible.Content>
	</Card>
</Collapsible.Root>
