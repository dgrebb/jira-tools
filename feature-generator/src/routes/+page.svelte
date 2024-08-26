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
	const animationTime = $derived(features.length * 300 + 667);
	let fileInput: HTMLInputElement;

	$effect(() => {
		loadingTimer = setTimeout(() => {
			featuresElement?.classList.add('animated');
		}, animationTime);
		loading = false;

		return () => {
			if (loadingTimer) {
				clearTimeout(loadingTimer);
			}
		};
	});

	const exportFeatures = () => {
		const dataStr = JSON.stringify(features, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = 'features.json';

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	};

	function triggerFileInput() {
		fileInput.click();
	}

	const importFeatures = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const result = e.target?.result as string;
					const importedFeatures = JSON.parse(result) as Feature[];
					features = importedFeatures;
				} catch (error) {
					console.error('Error parsing the imported JSON file:', error);
					alert('Failed to import features. Please make sure the file format is correct.');
				}
			};

			reader.readAsText(file);
		}
	};
</script>

<Introduction />

<section class="prompt card p-4">
	<FeatureForm {DEBUG} bind:loading bind:features />
	<div class="mt-4 flex space-x-2">
		<button class="btn-export" onclick={exportFeatures}>Export Features</button>
		<input type="file" bind:this={fileInput} onchange={importFeatures} class="hidden" />
		<button class="btn-import" onclick={triggerFileInput}>Import Features</button>
	</div>
</section>

{#if loading === true}
	<LoadingIssues />
{/if}

{#if features.length > 0}
	<Tabs.Root>
		{#if features.length > 1}
			<Tabs.List class="grid w-full grid-cols-2">
				{#each features as feature (feature.name)}
					{#if feature.name}
						<Tabs.Trigger value={feature.name}>{feature.name}</Tabs.Trigger>
					{/if}
				{/each}
			</Tabs.List>
		{/if}
		<section class="features" bind:this={featuresElement}>
			<div class="w-full sm:p-4">
				<div class="rounded-md border">
					{#each features as feature (feature.name)}
						<Tabs.Content value={feature.name} class="mt-0 max-h-[50vh] overflow-auto">
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
{/if}
