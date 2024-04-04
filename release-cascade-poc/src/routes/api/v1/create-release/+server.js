import { API_URL, BEARER } from '$lib/apiConfig.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const params = await request.json();
	const { name, description, project } = params;

	const headers = new Headers();
	headers.append('authorization', `Bearer ${BEARER}`);
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

	try {
		const response = await fetch(`${API_URL}/rest/api/2/version`, {
			...options,
			body
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const responseData = await response.json();

		// TODO: this should be replaced with a real logging solution
		console.log(responseData);
		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: {
				'content-type': 'application/json'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: {
				'content-type': 'application/json'
			}
		});
	}
}
