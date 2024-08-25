<script lang="ts">
	import Epic from '@components/Epic.svelte';
	import Introduction from '@components/Introduction.svelte';
	import type { Feature } from '@types';

	import FeatureForm from '@components/FeatureForm.svelte';
	import LoadingIssues from '@components/LoadingIssues.svelte';
	import * as Table from '@components/ui/table/index.js';
	import * as Tabs from '@components/ui/tabs/index.js';

	const DEBUG = true;

	let loading: boolean = $state(false);
	let features: Feature[] = $state([]);
	let featuresElement: HTMLElement | undefined = $state();
	let loadingTimer: NodeJS.Timeout | null = null;
	const animationTime = $derived(features.length * 30000000 + 667);

	$effect(() => {
		loadingTimer = setTimeout(() => {
			featuresElement?.classList.add('animated');
		}, animationTime);
		loading = false;

		() => {
			if (loadingTimer) {
				clearTimeout(loadingTimer);
			}
		};
	});
</script>

<Introduction />

<section class="prompt card p-4">
	<FeatureForm {DEBUG} bind:loading bind:features />
</section>

{#if loading === true}
	{loading}
	<LoadingIssues />
{/if}

{#if features.length > 0}
	<section class="features max-h-[80%]" bind:this={featuresElement}>
		<div class="w-full sm:p-4">
			<Tabs.Root>
				<Tabs.List class="grid w-full grid-cols-2">
					{#each features as feature}
						{#if feature.name}
							<Tabs.Trigger value={feature.name}>{feature.name}</Tabs.Trigger>
						{/if}
					{/each}
				</Tabs.List>
				<div class="rounded-md border">
					{#each features as feature}
						<Tabs.Content value={feature.name}>
							<svelte:fragment>
								<Table.Root>
									<Table.Header>
										<Table.Row class="">
											<Table.Head class="font-medium">Type</Table.Head>
											<!-- <Table.Head class="font-medium">ID</Table.Head> -->
											<Table.Head class="font-medium">Summary</Table.Head>
											<Table.Head class="font-medium">Project</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each feature.epics as epic}
											<Epic {epic} />
										{/each}
									</Table.Body>
								</Table.Root>
							</svelte:fragment>
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>
		</div>
	</section>
{/if}
