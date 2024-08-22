<script lang="ts">
	import { apiConfig } from '$lib/apiConfig';
	import OpenAI from 'openai';
	type Feature = {
		epics: unknown[];
		stories: unknown[];
		tasks: unknown[];
	};
	let selectedModel = $state(apiConfig.models[0]);
	let message: string = $state('');
	let messages: OpenAI.Chat.ChatCompletionMessage[] = [
		{
			role: 'assistant',
			content:
				'You are a helpful assistant product owner. Together we will write fantastic and description user stories for Jira, including Gherkin for user acceptance criteria. You will respond in JSON format. Epics should be stored in the `epics` property. User stories in the `stories` property, at root level or nested in epics as instructed. Sub-tasks in the `tasks` property, at root level, inside user stories as instructed, and also inside epics if instructed. Each item has the following properties and values based on its type: issue_type: "Epic" | "Story" | "Sub-task" | "Defect", Issue ID: number, parent (this should be the parent JSON object ID): number, summary: string, description: string, assignee: string, reporter: string, project_name: string, project_key: string, and project_type: "Software"'
		}
	];
	let response: string = $state('');

	let features: Feature[] = $state([]);

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});
	async function sendMessage() {
		messages = [...messages, { role: 'assistant', content: message }];
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

			// Add the parsed data to features array
			features.push(data as Feature);
			console.log('🚀 ~ sendMessage ~ data:', $state.snapshot(features));
		} catch (parseError) {
			console.error('Error parsing response:', parseError);
			response = 'Error parsing response. Please check the console for more information.';
		}
	}
</script>

<div>
	<select bind:value={selectedModel}>
		{#each apiConfig.models as model}
			<option value={model}>{model}</option>
		{/each}
	</select>
	<input type="text" bind:value={message} placeholder="Type your message here..." />
	<button onclick={sendMessage}>Send</button>
</div>

<div>
	{#if features.length > 0}
		{#each features as { epics }}
			{#each epics as { stories: { tasks } }}
				<h1>{summary}</h1>
				{#each stories as { summary }}
					<h1>{summary}</h1>
					{#each tasks as { summary }}
						<h1>{summary}</h1>
					{/each}
				{/each}
			{/each}
		{/each}
	{/if}
</div>
