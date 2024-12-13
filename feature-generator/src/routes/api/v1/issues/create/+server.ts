import { JIRA_PAT } from '@config/apiConfig';

type IssueType = 'Feature' | 'Epic' | 'User Story' | 'Sub-task';

interface Issue {
	issuetype: IssueType;
	summary: string;
	description?: string;
	assignee?: string;
	reporter?: string;
	epics?: Issue[];
	stories?: Issue[];
	tasks?: Issue[];
}

interface CreateIssueResponse {
	id: string;
	key: string;
	self: string;
}

interface PollingState {
	total: number;
	completed: number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createIssueWithBackoff(
	fetch,
	issue: Issue,
	parentKey?: string,
	projectKey = 'BIZ'
): Promise<CreateIssueResponse> {
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Bearer ${JIRA_PAT}`
	});

	const fields: unknown = {
		project: { key: projectKey },
		summary: issue.summary,
		description: issue.description || '',
		issuetype: { name: issue.issuetype }
	};

	// Add parent or custom fields based on the type
	if (parentKey) {
		if (issue.issuetype === 'Epic') {
			fields.customfield_10108 = parentKey; // Link Epic to parent Feature
			fields.customfield_10104 = issue.summary; // Epic Name field
		} else if (issue.issuetype === 'User Story') {
			fields.customfield_10008 = parentKey; // Link Story to parent Epic
		} else if (issue.issuetype === 'Sub-task') {
			fields.parent = { key: parentKey }; // Link Sub-task to parent Story
		}
	}

	const body = JSON.stringify({ fields });
	const requestOptions = {
		method: 'POST',
		headers,
		body
	};

	let attempts = 0;
	const maxAttempts = 5;
	const initialBackoff = 2000; // 2 seconds
	let backoff = initialBackoff;

	while (attempts < maxAttempts) {
		try {
			const response = await fetch('/api/v1/issues/create', requestOptions);

			if (response.status === 429) {
				console.warn(`Rate limit hit. Retrying after ${backoff}ms...`);
				await delay(backoff);
				backoff *= 2; // Exponential backoff
				attempts++;
				continue;
			}

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to create issue: ${errorText}`);
			}

			return response.json() as Promise<CreateIssueResponse>;
		} catch (error) {
			attempts++;
			console.error(`Attempt ${attempts} failed for ${issue.summary}.`, error);

			if (attempts >= maxAttempts) {
				throw new Error(`Exceeded retry limit for ${issue.summary}`);
			}
		}
	}

	throw new Error(`Failed to create issue: ${issue.summary} after ${maxAttempts} attempts.`);
}

async function traverseAndCreateFeatures(
	fetch,
	features: Issue[],
	projectKey = 'BIZ',
	pollingState?: PollingState
): Promise<void> {
	for (const feature of features) {
		try {
			// Create the feature and process its epics
			const createdFeature = await createIssueWithBackoff(fetch, feature, undefined, projectKey);
			console.log(`Created Feature: ${createdFeature.key}`);

			// Update polling state
			if (pollingState) {
				pollingState.completed++;
				updateUI(pollingState);
			}

			// Process epics for the feature
			if (feature.epics) {
				console.log('🚀 ~ feature.epics:', feature.epics);
				for (const epic of feature.epics) {
					const createdEpic = await createIssueWithBackoff(epic, createdFeature.key, projectKey);
					// Update polling state
					if (pollingState) {
						pollingState.completed++;
						updateUI(pollingState);
						console.log(`Created Epic: ${createdEpic.key}`);
					}

					if (epic.stories) {
						for (const story of epic.stories) {
							const createdStory = await createIssueWithBackoff(story, createdEpic.key, projectKey);
							// Update polling state
							if (pollingState) {
								pollingState.completed++;
								updateUI(pollingState);
								console.log(`Created Story: ${createdStory.key}`);
							}

							if (story.tasks) {
								for (const task of story.tasks) {
									const createdTask = await createIssueWithBackoff(
										task,
										createdStory.key,
										projectKey
									);
									// Update polling state
									if (pollingState) {
										pollingState.completed++;
										updateUI(pollingState);
										console.log(`Created Task: ${createdTask.key}`);
									}
								}
							}
						}
					}
				}
			}
		} catch (error) {
			console.error(`Error creating Feature: ${feature.summary}`, error);
		}
	}
}

// UI Update Function
function updateUI(state: PollingState) {
	console.log(`Progress: ${state.completed} / ${state.total}`);
	// Replace this with your actual UI update logic
}

// Helper function to count all issues in the source data
function countIssues(issues: Issue[]): number {
	let count = 0;

	function countRecursive(issues: Issue[]) {
		for (const issue of issues) {
			count++;
			if (issue.epics) countRecursive(issue.epics);
			if (issue.stories) countRecursive(issue.stories);
			if (issue.tasks) countRecursive(issue.tasks);
		}
	}

	countRecursive(issues);
	return count;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ fetch, request }) {
	try {
		const params = await request.json();
		const { issues } = params;
		console.log('🚀 ~ POST ~ issues.features:', issues.features);

		// Validate the input structure
		if (!issues || !Array.isArray(issues?.features)) {
			console.error("Invalid input: 'issues.features' is undefined or not an array");
			return new Response(
				JSON.stringify({ error: "Invalid input structure: 'issues.features' is required." }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Count the total number of issues
		const totalIssues = countIssues(issues.features);
		const pollingState: PollingState = { total: totalIssues, completed: 0 };

		console.log(`Starting issue creation. Total issues to process: ${totalIssues}`);

		// Process features
		const responseData = await traverseAndCreateFeatures(
			fetch,
			issues.features,
			'BIZ',
			pollingState
		);

		console.log('All issues processed successfully.');
		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: {
				'content-type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error processing issues:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to process issues', details: error.message }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
