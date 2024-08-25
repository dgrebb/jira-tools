<script lang="ts">
	import type { Story, Task } from '@types';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Card } from './ui/card';

	export let story: Story;
	let tasks: Task[] = story.tasks;
</script>

<Collapsible.Root>
	<Card class="features mt-8">
		<Collapsible.Trigger>
			<img
				src="/img/jira-story-icon.png"
				height={33}
				width={33}
				alt="Jira User Story Icon: two squares overlapping one another, with one heavily outlined and no fill color, like a donut; and the other filled in, representing the 'blueprint' or 'story' before the feature becomes fully filled in."
				class="grow-0 flex-col self-center"
			/>
			<h3 class="task-summary scroll-m-20 text-2xl font-semibold tracking-tight">
				{story.summary}
			</h3></Collapsible.Trigger
		>
		<Collapsible.Content>
			{story.description}
			{#each tasks as task}
				<li class="task flex items-start">
					<div>
						<img
							src="/img/jira-sub-task-icon.png"
							height={33}
							width={33}
							alt="Jira Sub-Task Icon: Represents a Lightning Bolt"
							class="grow-0 flex-col self-center"
						/>
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
