<script lang="ts">
	import { apiConfig } from '$lib/apiConfig';
	import OpenAI from 'openai';
	import type { Messages } from 'openai/resources/beta/threads/messages/messages.mjs';
	type Item = {
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
	let response: string = '';

	let items: any[] = $state([]);

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	async function sendMessage() {
		messages = [...messages, { role: 'assistant', content: message }];
		// try {
		// 	const res = await openai.chat.completions.create({
		// 		model: selectedModel,
		// 		messages,
		// 		temperature: 1,
		// 		max_tokens: 1000,
		// 		top_p: 1,
		// 		frequency_penalty: 0,
		// 		presence_penalty: 0,
		// 		response_format: {
		// 			type: 'json_object'
		// 		}
		// 	});
		// 	// response = res.choices[0].message.content || '';
		// } catch (error) {
		// 	console.error('Error sending message:', error);
		// 	response = 'Error sending message. Please check the console for more information.';
		// }
		// let data: unknown = JSON.parse(response);
		let data = JSON.parse(
			'{\n  "epics": [\n    {\n      "issue_type": "Epic",\n      "issue_ID": 1,\n      "summary": "Red Box on Hero Section",\n      "description": "As a user, I want to see a red box on the hero section of the website, so that it stands out and catches my attention.",\n      "project_name": "Awesome Website",\n      "project_key": "AW",\n      "project_type": "Software",\n      "stories": [\n        {\n          "issue_type": "Story",\n          "issue_ID": 2,\n          "parent": 1,\n          "summary": "Create Red Box Component",\n          "description": "As a developer, I need to create a reusable red box component with customizable content and styles.",\n          "assignee": "John Developer",\n          "reporter": "Product Owner",\n          "tasks": [\n            {\n              "issue_type": "Sub-task",\n              "issue_ID": 3,\n              "parent": 2,\n              "summary": "Define Red Box Styling",\n              "description": "Define the CSS styles for the red box component, including background color, padding, and border radius.",\n              "assignee": "Jane Designer",\n              "reporter": "John Developer",\n              "project_name": "Awesome Website",\n              "project_key": "AW",\n              "project_type": "Software"\n            }\n          ]\n        },\n        {\n          "issue_type": "Story",\n          "issue_ID": 4,\n          "parent": 1,\n          "summary": "Place Red Box on Hero Section",\n          "description": "As a front-end developer, I need to place the red box component in the hero section of the website using proper layout and positioning.",\n          "assignee": "Alice Frontend",\n          "reporter": "Product Owner",\n          "project_name": "Awesome Website",\n          "project_key": "AW",\n          "project_type": "Software"\n        }\n      ]\n    }\n  ]\n}'
		);

		items.push(data);
		$: console.log('🚀 ~ sendMessage ~ items:', ...items);
	}
</script>

<div>
	<select bind:value={selectedModel}>
		{#each apiConfig.models as model}
			<option value={model}>{model}</option>
		{/each}
	</select>
	<input type="text" bind:value={message} placeholder="Type your message here..." />
	<button on:click={sendMessage}>Send</button>
</div>

<div>
	{#if items.length > 0}
		{#each items as { epics, stories, tasks }}
			{#each epics as { summary, stories, stories: { tasks } }}
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
