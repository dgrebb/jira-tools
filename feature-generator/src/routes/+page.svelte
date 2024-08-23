<script lang="ts">
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Epic from '@components/Epic.svelte';

	import { apiConfig } from '@lib/apiConfig';
	import mockResponse from '@mocks/chat-gpt-feature-completion.json';
	import type { Feature } from '@types';

	import OpenAI from 'openai';
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
	let response: string = $state('');

	const features: Feature[] = mockResponse as Feature[];
	// let features: Feature[] = $state([]);

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});
	async function sendMessage() {
		// messages = [...messages, { role: 'assistant', content: message, refusal: null }];
		// try {
		// const res = await openai.chat.completions.create({
		// 	model: selectedModel,
		// 	messages,
		// 	temperature: 1,
		// 	max_tokens: 1000,
		// 	top_p: 1,
		// 	frequency_penalty: 0,
		// 	presence_penalty: 0,
		// 	response_format: {
		// 		type: 'json_object'
		// 	}
		// });
		// 	response = mockResponse; // res.choices[0].message.content || '';
		// } catch (error) {
		// 	console.error('Error sending message:', error);
		// 	response = 'Error sending message. Please check the console for more information.';
		// }

		try {
			// // Attempt to parse the response if it's a stringified JSON
			// let data: unknown;
			// if (typeof response === 'string') {
			// 	data = JSON.parse(response);
			// } else {
			// 	data = response;
			// }

			// // If the data itself contains stringified JSON properties, parse them too
			// if (typeof data === 'string') {
			// 	data = JSON.parse(data);
			// }

			console.log('🚀 ~ sendMessage ~ features:', $state.snapshot(features));
			// Add the parsed data to features array
			// features.push(data);
		} catch (parseError) {
			console.error('Error parsing response:', parseError);
			response = 'Error parsing response. Please check the console for more information.';
		}
	}
</script>

<section class="prompt">
	<form onsubmit={sendMessage} class="card-body">
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
</section>

{#if features.length > 0}
	<section class="features mt-8 max-h-[80%]">
		<ScrollArea class="shrink-1 flex">
			<div class="flex flex-col gap-2 p-4 pt-0">
				{#each features as { epics }}
					{#each epics as epic}
						<Epic {epic} />
					{/each}
				{/each}
				{#each features as { epics }}
					{#each epics as epic}
						<Epic {epic} />
					{/each}
				{/each}
			</div>
		</ScrollArea>
	</section>
{/if}
