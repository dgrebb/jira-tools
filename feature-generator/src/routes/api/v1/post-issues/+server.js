import { JIRA_PAT } from '@config/apiConfig';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const params = await request.json();
	const { name, description, project } = params;

	const headers = new Headers();
	// headers.append('authorization', `Bearer ${JIRA_API_BEARER_TOKEN}`);
	headers.append('authorization', `Bearer ${JIRA_PAT}`);
	headers.append('accept', 'application/json');
	headers.append('content-type', 'application/json');

	const options = {
		method: 'POST',
		headers
	};
	const body = JSON.stringify({
		archived: false,
		description,
		name,
		project,
		released: false
	});

	// Maximum number of retries
	const maxRetries = 5;
	// Initial wait time in milliseconds
	let waitTime = 1000;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const response = await fetch(`${JIRA_API_URL}${JIRA_API_PATH}`, {
				...options,
				body
			});

			if (response.status === 429) {
				const retryAfter = response.headers.get('Retry-After');
				// If the server provided a specific retry time, use it
				if (retryAfter) {
					waitTime = parseInt(retryAfter) * 1000;
				}

				// Wait for the specified time before retrying
				await new Promise((resolve) => setTimeout(resolve, waitTime));
				// Exponential backoff for the next retry
				waitTime *= 2;
				continue;
			}

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const responseData = await response.json();

			// Log the successful response (replace with a real logging solution)
			console.log(responseData);
			return new Response(JSON.stringify(responseData), {
				status: 200,
				headers: {
					'content-type': 'application/json'
				}
			});
		} catch (error) {
			if (attempt === maxRetries - 1) {
				// If the final attempt fails, return an error response
				console.error(error);
				return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
					status: 500,
					headers: {
						'content-type': 'application/json'
					}
				});
			}
		}
	}
}
