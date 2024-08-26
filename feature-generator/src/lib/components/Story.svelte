<script lang="ts">
	import type { Story, Task } from '@types';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Card } from './ui/card';

	export let story: Story;
	let tasks: Task[] = story.tasks;
</script>

<Collapsible.Root class=" my-1 first-of-type:mt-8">
	<Card class="features p-4">
		<Collapsible.Trigger class="flex flex-row">
			<img
				src="/img/jira-story-icon.png"
				height={33}
				width={33}
				alt="Jira User Story Icon: two squares overlapping one another, with one heavily outlined and no fill color, like a donut; and the other filled in, representing the 'blueprint' or 'story' before the feature becomes fully filled in."
				class="grow-0 flex-col self-center pr-3"
			/>
			<h3 class="task-summary scroll-m-20 text-2xl font-semibold tracking-tight">
				{story.summary}
			</h3></Collapsible.Trigger
		>
		<Collapsible.Content>
			<p class="my-3">{story.description}</p>
			<ul>
				{#each tasks as task}
					<li class="task mt-1 flex flex-row first-of-type:mt-0">
						<img
							src="/img/jira-sub-task-icon.png"
							height={20}
							width={20}
							alt="Jira Sub-Task Icon: Represents a Lightning Bolt"
							class="mr-3 grow-0 flex-col self-center"
						/>
						<div class="flex flex-col items-start self-start">
							<h4 class="scroll-m-20 text-lg font-semibold tracking-tight">
								{task.summary}
							</h4>
							<p class="task-description">{task.description}</p>
						</div>
					</li>
				{/each}
			</ul>
		</Collapsible.Content>
	</Card>
</Collapsible.Root>
