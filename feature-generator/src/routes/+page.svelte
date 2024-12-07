<script lang="ts">
	import Epic from '@components/Epic.svelte';
	import Introduction from '@components/Introduction.svelte';
	import type { Feature } from '@types';

	import FeatureForm from '@components/FeatureForm.svelte';
	import LoadingIssues from '@components/LoadingIssues.svelte';
	import { Button } from '$lib/components/ui/button';
	import Features from '$lib/components/Features.svelte';

	const DEBUG = false;

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
					features.push(importedFeatures);
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
		<Button class="btn-export" onclick={exportFeatures}>Export Features</Button>
		<input type="file" bind:this={fileInput} onchange={importFeatures} class="hidden" />
		<Button class="btn-import" onclick={triggerFileInput}>Import Features</Button>
	</div>
</section>

{#if loading === true}
	<LoadingIssues />
{/if}

{#if features && features.length > 0}
	<Features {features} {featuresElement} />
{/if}
