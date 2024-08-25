<script lang="ts">
	import Epic from '@components/Epic.svelte';
	import Introduction from '@components/Introduction.svelte';
	import { apiConfig } from '@lib/apiConfig';
	import mockResponse from '@mocks/chat-gpt-feature-completion.json';
	import type { Feature } from '@types';
	import OpenAI from 'openai';

	import LoadingIssues from '@components/LoadingIssues.svelte';
	import * as Table from '@components/ui/table/index.js';
	import * as Tabs from '@components/ui/tabs/index.js';

	const DEBUG = true;

	let loading: boolean = $state(false);
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
	let features: Feature[] = $state([]);

	const openai = new OpenAI({
		apiKey: apiConfig.apiKey,
		dangerouslyAllowBrowser: true
	});

	async function sendMessage() {
		loading = true;
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

	let featuresElement: HTMLElement | undefined = $state();
	let loadingTimer: NodeJS.Timeout | null = null;
	const animationTime = $derived(features.length * 30000000 + 667);

	$effect(() => {
		loadingTimer = setTimeout(() => {
			featuresElement?.classList.add('animated');
		}, animationTime);
		loading = false;

		() => {
			if (loadingTimer) {
				clearTimeout(loadingTimer);
			}
		};
	});
</script>

<Introduction />

<section class="prompt card p-4">
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
</section>

{#if loading === true}
	{loading}
	<LoadingIssues />
{/if}

{#if features.length > 0}
	<section class="features max-h-[80%]" bind:this={featuresElement}>
		<div class="w-full sm:p-4">
			<Tabs.Root>
				<Tabs.List class="grid w-full grid-cols-2">
					{#each features as feature}
						{#if feature.name}
							<Tabs.Trigger value={feature.name}>{feature.name}</Tabs.Trigger>
						{/if}
					{/each}
				</Tabs.List>
				<div class="rounded-md border border-zinc-800">
					{#each features as feature}
						<Tabs.Content value={feature.name}>
							<svelte:fragment>
								<Table.Root>
									<Table.Header>
										<Table.Row class="border-zinc-800">
											<Table.Head class="font-medium">Type</Table.Head>
											<!-- <Table.Head class="font-medium">ID</Table.Head> -->
											<Table.Head class="font-medium">Summary</Table.Head>
											<Table.Head class="font-medium">Project</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each feature.epics as epic}
											<Epic {epic} />
										{/each}
									</Table.Body>
								</Table.Root>
							</svelte:fragment>
						</Tabs.Content>
					{/each}
				</div>
			</Tabs.Root>
		</div>
	</section>
{/if}
