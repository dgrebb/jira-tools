<script lang="ts">
	/** eslint-disable svelte/no-at-html-tags */
	import OpenAI from 'openai';
	import { Button } from '$lib/components/ui/button';
	import { mockMarkdownResponse } from '@mocks/chat-gpt-feature-0.js';
	import mockIssuesJSON from '@mocks/chat-gpt-feature-4.json';
	import { parserMdJiraJSONIssues } from '@utils/mdJSONJiraIssueParser';
	import { apiConfig } from '../../config/apiConfig';
	import Textarea from './ui/textarea/textarea.svelte';
	import { workingIssuesState } from '@state';

	interface Props {
		DEBUG: boolean;
		loading: boolean;
	}

	let { DEBUG, loading = $bindable() }: Props = $props();
	let selectedModel = $state(apiConfig.models[0]);
	let response: object = $state({});

	// NOTE: Commented while iterating on JSON/markdown parse functionality
	// Chat messages
	let messages: Array<{
		role: 'system' | 'assistant' | 'user';
		content: string;
		refusal?: string | null;
	}> = [
		{
			role: 'system',
			content: `You are a helpful assistant that outputs markdown for Jira tasks. It will later on be transformed into JSON by means of a markdown parser. There are four types of Jira issues to create, some with a parent/child relationship. Each of these Jira Issue types will have a corresponding heading level in the markdown structure. The text for the headings is the Jira "summary" field content, which includes a title for the issue. Each issue type has a specific heading, no matter the structure of the result from user prompt.

			Eg. if a user only asks for User Stories and Sub-Tasks, the heading level does not change.

			Features are H1, Epics are H2, User Stories are H3, and Sub-Tasks are H4.

			Please see a generic example of the markdown:

			${mockMarkdownResponse}

			and a final JSON object which contains the properties we need:

			${mockIssuesJSON}

			When the full schema is requested, users will ask for a Feature with description and other properties. If a feature is requested, users may also ask for Epics to be created as children of the feature. Epics then break down into User Stories, and User Stories into Sub-Tasks. `
		}
	];

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	let message: string = $state('');

	async function sendMessage() {
		loading = true;

		// NOTE: Comment while markdown parsing is implemented with mock
		messages.push({ role: 'user', content: message });

		try {
			// NOTE: Comment while markdown parsing is implemented with mock
			const res = await openai.chat.completions.create({
				model: selectedModel,
				messages,
				temperature: 0,
				max_tokens: apiConfig.max_tokens,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0
			});

			const rawContent = res.choices[0]?.message?.content || '';

			// NOTE: Simulate response (Replace with real OpenAI API call)
			// const rawContent = mockMarkdownResponse;

			// Parse the raw Markdown response into JSON
			response = parserMdJiraJSONIssues(rawContent);
			workingIssuesState.setIssues(response);
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

{#if DEBUG && Object.keys(response).length > 0}
	<section class="debug flex flex-row">
		<pre class="debug-output">{JSON.stringify(response).trim()}</pre>
	</section>
{/if}

<style>
	.debug {
		overflow: scroll;
		flex-shrink: 1;
	}
	.debug-output {
		padding: 1rem 0;
		text-wrap: wrap;
	}
</style>
