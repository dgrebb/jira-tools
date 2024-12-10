<script lang="ts">
	import Introduction from '@components/Introduction.svelte';
	import type { IssuesType } from '@types';

	import FeatureForm from '@components/FeatureForm.svelte';
	import LoadingIssues from '@components/LoadingIssues.svelte';
	import { Button } from '$lib/components/ui/button';
	import Features from '$lib/components/Features.svelte';
	import { workingIssuesState } from '@state';

	const DEBUG = false;

	let loading: boolean = $state(false);
	let issues: IssuesType = $state({});
	let featuresElement: HTMLElement | undefined = $state();
	let issuesLoaded: boolean = $state(false);
	let loadingTimer: NodeJS.Timeout | null = null;
	const animationTime = $derived((issues?.features?.length || 1) * 300 + 667);
	let fileInput: HTMLInputElement;
	let message: string = $state('');

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

	const exportIssues = () => {
		const dataStr = JSON.stringify(issues, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = 'issues.json';

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	};

	function triggerFileInput() {
		fileInput.click();
	}

	const importIssues = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const result = e.target?.result as string;
					const importedIssues = JSON.parse(result) as IssuesType;
					issues = importedIssues;
				} catch (error) {
					console.error('Error parsing the imported JSON file:', error);
					alert('Failed to import issues. Please make sure the file format is correct.');
				}
			};

			reader.readAsText(file);
		}
	};

	$effect(() => {
		issues = workingIssuesState.getIssues();
		console.log('🚀 ~ $effect ~ issues:', $state.snapshot(issues));

		issuesLoaded = Object.keys(issues).length > 0;
	});
</script>

<Introduction />

{#if !loading}
	<section class="prompt card overflow-auto p-4">
		<FeatureForm {DEBUG} {message} bind:loading />
		<div class="mt-4 flex space-x-2">
			<Button class="btn-export" onclick={exportIssues}>Export issues</Button>
			<input type="file" bind:this={fileInput} onchange={importIssues} class="hidden" />
			<Button class="btn-import" onclick={triggerFileInput}>Import issues</Button>
		</div>
	</section>
{/if}

{#if loading}<LoadingIssues />{/if}

{#if issuesLoaded}
	<h1>Features</h1>
	<Features {issues} {featuresElement} />
{/if}
