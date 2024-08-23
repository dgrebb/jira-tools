<script lang="ts">
	import Story from './Story.svelte';
	import type { Epic } from '@types';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from './ui/button';

	interface Props {
		epic: Epic;
	}

	let { epic }: Props = $props();
</script>

<Collapsible.Root>
	<div class="card bg-zinc-800 p-4">
		<Collapsible.Trigger
			class="focus:bg-primary hover:bg-primary flex w-full rounded-lg p-4 text-left transition-colors"
		>
			<img
				src="/img/jira-epic-icon.png"
				height={33}
				width={33}
				alt="Jira Epic Icon: Represents a Lightning Bolt"
				class="grow-0 flex-col self-center"
			/>
			<h2 class="scroll-m-20 border-0 p-2 text-3xl font-semibold tracking-tight">
				{epic.summary}
			</h2>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<p class="mt-3 p-2">{epic.description}</p>
			{#each epic.stories as story}
				<Story {story} />
			{/each}
		</Collapsible.Content>
	</div>
</Collapsible.Root>
