<script lang="ts">
	import type { FeatureType, EpicType, StoryType, TaskType } from '@types';
	import * as Tabs from '@components/ui/tabs';
	import * as Table from '@components/ui/table';
	import Epic from '@components/Epic.svelte';

	type Props = {
		features?: FeatureType[];
		epics?: EpicType[];
		featuresElement: HTMLElement | undefined;
	};

	let { features, epics, featuresElement }: Props = $props();
</script>

{#if features && features.length >= 1}
	<Tabs.Root>
		<!-- Multiple features: Use Tabs.List -->
		<Tabs.List class="grid w-full grid-cols-2">
			{#each features as feature (feature.summary)}
				{#if feature.summary}
					<Tabs.Trigger value={feature.summary}>{feature.summary}</Tabs.Trigger>
				{/if}
			{/each}
		</Tabs.List>
		<section class="features" bind:this={featuresElement}>
			<div class="w-full sm:p-4">
				<div class="rounded-md border">
					{#each features as feature (feature.summary)}
						<Tabs.Content value={feature.summary} class="mt-0 max-h-[50vh] overflow-auto">
							<Table.Root class="overflow-hidden">
								<Table.Body>
									{#each feature.epics as epic (epic.issue_id)}
										<Epic {epic} />
									{/each}
								</Table.Body>
							</Table.Root>
						</Tabs.Content>
					{/each}
				</div>
			</div>
		</section>
	</Tabs.Root>
{:else if epics && epics.length}
	<section class="features" bind:this={featuresElement}>
		<div class="w-full sm:p-4">
			<div class="max-h-[50vh] overflow-auto rounded-md border">
				<Table.Root>
					<Table.Body>
						{#each epics as epic (epic.issue_id)}
							<Epic {epic} />
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</section>
{/if}
