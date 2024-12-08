<script lang="ts">
	import { apiConfig } from '../../config/apiConfig';
	import mockResponse from '@mocks/chat-gpt-feature-4.json';
	import { chatGPTMarkdownResponse1 } from '@mocks/chat-gpt-feature-0.js';
	import type { FeatureType, EpicType, StoryType, TaskType } from '@types';
	import OpenAI from 'openai';
	import Textarea from './ui/textarea/textarea.svelte';
	import { Button } from '$lib/components/ui/button';
	import { parserMdJiraJSONIssues } from '@utils/mdJSONJiraIssueParser';

	interface Props {
		DEBUG: boolean;
		loading: boolean;
		issues: {
			features?: FeatureType[];
			epics?: EpicType[];
			stories?: StoryType[];
			tasks?: TaskType[];
		};
	}

	let { DEBUG, loading = $bindable(), issues = $bindable() }: Props = $props();
	let selectedModel = $state(apiConfig.models[0]);
	let message: string = $state('');
	let response: object = $state({});
	let debugOutput: object = $state({});

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	async function sendMessage() {
		loading = true;

		try {
			// Simulate response (Replace with real OpenAI API call)
			const rawContent = chatGPTMarkdownResponse1;
			console.log('🚀 ~ sendMessage ~ rawContent:', rawContent);

			// Parse the raw Markdown response into JSON
			response = parserMdJiraJSONIssues(rawContent);

			// Log parsed data for debugging
			console.log('🚀 ~ sendMessage ~ response:', response);

			// Update `issues` to notify parent component
			issues = { ...response };
			debugOutput = $state.snapshot(response);
		} catch (error) {
			console.error('Error during API request:', error);
			response = {
				status: 'error',
				message: 'Error sending message. Please check the console for details.'
			};
		} finally {
			loading = false;
		}
	}
</script>

/** eslint-disable svelte/no-at-html-tags */
<form onsubmit={sendMessage} class="card-body flex-row">
	{#if DEBUG}
		<div class="form-control">
			<label class="label" for="model">
				<span class="label-text">Select Model</span>
			</label>
			<select bind:value={selectedModel} class="select select-bordered" name="model">
				{#each apiConfig.models as model}
					<option value={model}>{model}</option>
				{/each}
			</select>
		</div>
	{/if}
	<div class="form-control mt-4">
		<label class="label" for="prompt-message">
			<span class="label-text">Message</span>
		</label>
		<Textarea
			bind:value={message}
			name="prompt-message"
			class="input input-bordered"
			placeholder="Type your message here..."
		/>
	</div>
	<div class="form-control mt-6">
		<Button type="submit" class="btn btn-primary" disabled={loading}>
			{loading ? 'Loading...' : 'Send'}
		</Button>
	</div>
</form>

{#if DEBUG && Object.keys(issues).length > 0}
	<section class="debug flex flex-row">
		<h2>Raw Response</h2>
		<pre class="debug-output">
		{JSON.stringify(debugOutput)}
	</pre>
	</section>
{/if}

<style>
	.debug {
		overflow: scroll;
		flex-shrink: 1;
	}
	.debug-output {
		text-wrap: wrap;
	}
</style>
