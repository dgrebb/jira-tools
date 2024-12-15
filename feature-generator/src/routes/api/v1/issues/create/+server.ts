import { jiraConfig } from '@config/apiConfig';
import type { RequestOptions } from '@sveltejs/kit';
type Fetch = RequestOptions['fetch'];

const { JIRA_PAT, JIRA_PROTOCOL, JIRA_HOST, JIRA_API_PATH } = jiraConfig;

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

type JiraIssuePostFields = {
	project: { key: string };
	summary: string;
	description: string;
	issuetype: { name: string };
	[key: string]: unknown;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createIssueWithBackoff(
	fetch: Fetch,
	issue: Issue,
	parentKey?: string,
	projectKey = 'BIZ'
): Promise<CreateIssueResponse> {
	const headers = new Headers({
		'Content-Type': 'application/json',
		Authorization: `Bearer ${JIRA_PAT}`
	});

	const fields: JiraIssuePostFields = {
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
		} else if (issue.issuetype === 'Story') {
			fields.customfield_10102 = parentKey; // Link Story to parent Epic
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
			const response = await fetch(
				`${JIRA_PROTOCOL}://${JIRA_HOST}/${JIRA_API_PATH}/issue`,
				requestOptions
			);

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

async function processIssuesRecursively(
	fetch: RequestOptions['fetch'],
	issues: Issue[],
	parentKey: string | undefined,
	projectKey: string,
	pollingState: PollingState | undefined
): Promise<void> {
	for (const issue of issues) {
		try {
			// Create the issue
			const createdIssue = await createIssueWithBackoff(fetch, issue, parentKey, projectKey);

			// Update polling state
			if (pollingState) {
				pollingState.completed++;
				updateUI(pollingState);
			}

			// Recursively process child issues based on the hierarchy
			for (const key of ['epics', 'stories', 'tasks'] as const) {
				const childIssues = issue[key];
				if (childIssues) {
					await processIssuesRecursively(
						fetch,
						childIssues,
						createdIssue.key,
						projectKey,
						pollingState
					);
				}
			}
		} catch (error) {
			console.error(`Error creating ${issue.issuetype}: ${issue.summary}`, error);
		}
	}
}

async function traverseAndCreateFeatures(
	fetch: RequestOptions['fetch'],
	features: Issue[],
	projectKey = 'BIZ',
	pollingState?: PollingState
): Promise<void> {
	await processIssuesRecursively(fetch, features, undefined, projectKey, pollingState);
}

// UI Update Function
function updateUI(state: PollingState) {
	console.info(`Progress: ${state.completed} / ${state.total}`);
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
export const POST: RequestHandler = async ({ fetch, request }) => {
	try {
		const params = await request.json();
		const { features } = params.issues;

		// Validate the input structure
		if (!features || !Array.isArray(features)) {
			console.error("Invalid input: 'features' is undefined or not an array");
			return new Response(
				JSON.stringify({ error: "Invalid input structure: 'features' is required." }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// Count the total number of issues
		const totalIssues = countIssues(features);
		const pollingState: PollingState = { total: totalIssues, completed: 0 };

		console.info(`Starting issue creation. Total issues to process: ${totalIssues}`);

		// Process features
		const response = await traverseAndCreateFeatures(fetch, features, 'BIZ', pollingState);

		console.info('All issues processed successfully.');
		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				'content-type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error processing issues:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to process issues',
				details: error.message
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
