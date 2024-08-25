<script lang="ts">
	import type { Epic } from '@types';
	import Story from './Story.svelte';

	import * as Collapsible from '@components/ui/collapsible';
	import * as Table from '@components/ui/table/index.js';
	import Button from './ui/button/button.svelte';

	interface Props {
		epic: Epic;
	}

	let { epic }: Props = $props();
</script>

<Collapsible.Root asChild>
	<svelte:fragment>
		<Table.Row>
			<!-- <Table.Cell>{epic.issue_id}</Table.Cell> -->
			<Table.Cell>
				<img
					src="/img/jira-epic-icon.png"
					height={33}
					width={33}
					alt="Jira Epic Icon: Represents a Lightning Bolt"
					class="grow-0 flex-col self-center"
				/>
				<Collapsible.Trigger><Button>Expand</Button></Collapsible.Trigger>
			</Table.Cell>
			<Table.Cell>
				<h2 class="text-2l scroll-m-20 border-0 p-2 font-semibold tracking-tight">
					{epic.summary}
				</h2></Table.Cell
			>
			<Table.Cell>{epic.project_name}</Table.Cell>
		</Table.Row>
		<Table.Row class="hidden has-[div]:table-row">
			<Table.Cell colspan={3}>
				<Collapsible.Content>
					<p class="mt-3 p-2">{epic.description}</p>
					{#each epic.stories as story}
						<Story {story} />
					{/each}
				</Collapsible.Content>
			</Table.Cell>
		</Table.Row>
	</svelte:fragment>
</Collapsible.Root>
