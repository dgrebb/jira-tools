<script lang="ts">
	import { apiConfig } from '@lib/apiConfig';
	import mockResponse from '@mocks/chat-gpt-feature-4.json';
	import type { Feature } from '@types';
	import OpenAI from 'openai';
	import Textarea from './ui/textarea/textarea.svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		DEBUG: boolean;
		loading: boolean;
		features: Feature[];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let { DEBUG, loading = $bindable(), features = $bindable() }: Props = $props();
	console.log('🚀 ~ DEBUG:', DEBUG);

	let selectedModel = $state(apiConfig.models[0]);
	let message: string = $state('');
	let response: string = $state('');

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	let messages: Array<{
		role: 'system' | 'assistant' | 'user';
		content: string;
		refusal?: string | null;
	}> = [
		{
			role: 'system',
			content: `You are a helpful assistant product owner designed to output JSON. An example of the response format is: ${mockResponse}`,
			refusal: null
		},
		{
			role: 'assistant',
			content:
				'Together we will write fantastic and description user stories for Jira, including Gherkin for user acceptance criteria. You will respond in JSON format. Come up with a short, working title for the feature name and set the corresponding `feature.name` property. Epics should be stored in the `features[].epics[]` property. User stories in the `features[].epics[].stories` property. Sub-tasks in the `features[].epics[].stories[].tasks` property, at root level, inside user stories as instructed, and also inside epics if instructed. Each item has the following properties and values based on its type: issue_type: "Epic" | "Story" | "Sub-task" | "Defect", issue_id: number, parent (this should be the parent JSON object ID): number, summary: string, description: string, assignee: string, reporter: string, project_name: string, project_key: string, and project_type: "Software"',
			refusal: null
		}
	];

	async function sendMessage() {
		loading = true;
		if (!DEBUG) {
			messages = [...messages, { role: 'assistant', content: message, refusal: null }];
			try {
				const res = await openai.chat.completions.create({
					model: selectedModel,
					messages,
					temperature: 1,
					max_tokens: apiConfig.max_tokens,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					response_format: {
						type: 'json_object'
					}
				});
				response = res.choices[0].message.content || '';
				console.log('🚀 ~ sendMessage ~ response:', response);
				console.debug('Features received, processing issues.');
			} catch (error) {
				console.error('Error sending message:', error);
				response = 'Error sending message. Please check the console for more information.';
			}

			try {
				// Attempt to parse the response if it's a stringified JSON
				let data: {
					features: Feature[];
				};
				if (typeof response === 'string') {
					data = JSON.parse(response);
				} else {
					data = response;
				}

				// If the data itself contains stringified JSON properties, parse them too
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}

				// Add the parsed data to features array
				if (data.features) {
					features = data.features as Feature[];
					console.log('🚀 ~ sendMessage ~ features:', $state.snapshot(features));
				}
			} catch (parseError) {
				console.error('Error parsing response:', parseError);
				response = 'Error parsing response. Please check the console for more information.';
			}
		} else {
			setTimeout(() => {
				features = mockResponse.features as Feature[];
			}, 500);
		}
	}
</script>

<form onsubmit={sendMessage} class="card-body">
	{#if DEBUG === true}
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
		<Button type="submit" class="btn btn-primary">Send</Button>
	</div>
</form>
