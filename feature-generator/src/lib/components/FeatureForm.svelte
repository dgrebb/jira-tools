<script lang="ts">
	import { apiConfig } from '@lib/apiConfig';
	import mockResponse from '@mocks/chat-gpt-feature-completion.json';
	import type { Feature } from '@types';
	import OpenAI from 'openai';

	interface Props {
		DEBUG: boolean;
		loading: boolean;
		features: Feature[];
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let { DEBUG, loading = $bindable(), features = $bindable() }: Props = $props();
	console.log('🚀 ~ DEBUG:', DEBUG);

	let response: string = $state('');
	let selectedModel = $state(apiConfig.models[0]);
	let message: string = $state('');
	let messages: OpenAI.Chat.ChatCompletionMessage[] = [
		{
			role: 'assistant',
			content:
				'You are a helpful assistant product owner. Together we will write fantastic and description user stories for Jira, including Gherkin for user acceptance criteria. You will respond in JSON format. Epics should be stored in the `epics` property. User stories in the `stories` property, at root level or nested in epics as instructed. Sub-tasks in the `tasks` property, at root level, inside user stories as instructed, and also inside epics if instructed. Each item has the following properties and values based on its type: issue_type: "Epic" | "Story" | "Sub-task" | "Defect", Issue ID: number, parent (this should be the parent JSON object ID): number, summary: string, description: string, assignee: string, reporter: string, project_name: string, project_key: string, and project_type: "Software"',
			refusal: null
		}
	];

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	async function sendMessage() {
		loading = true;
		console.log('🚀 ~ sendMessage ~ loading:', loading);
		if (!DEBUG) {
			messages = [...messages, { role: 'assistant', content: message, refusal: null }];
			try {
				const res = await openai.chat.completions.create({
					model: selectedModel,
					messages,
					temperature: 1,
					max_tokens: 1000,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					response_format: {
						type: 'json_object'
					}
				});
				response = res.choices[0].message.content || '';
				console.debug('Features received, processing issues.');
			} catch (error) {
				console.error('Error sending message:', error);
				response = 'Error sending message. Please check the console for more information.';
			}

			try {
				// Attempt to parse the response if it's a stringified JSON
				let data: unknown;
				if (typeof response === 'string') {
					data = JSON.parse(response);
				} else {
					data = response;
				}

				// If the data itself contains stringified JSON properties, parse them too
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}

				console.log('🚀 ~ sendMessage ~ features:', $state.snapshot(features));
				// Add the parsed data to features array
				features.push(data as Feature);
			} catch (parseError) {
				console.error('Error parsing response:', parseError);
				response = 'Error parsing response. Please check the console for more information.';
			}
		} else {
			setTimeout(() => {
				features = mockResponse as Feature[];
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
		<input
			type="text"
			bind:value={message}
			class="input input-bordered"
			placeholder="Type your message here..."
		/>
	</div>
	<div class="form-control mt-6">
		<button type="submit" class="btn btn-primary">Send</button>
	</div>
</form>
