import { PROXY_PATH } from '$lib/apiConfig';
export async function createRelease(name, description, project) {
	const headers = new Headers();
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
		// Make the API POST call
		const response = await fetch(PROXY_PATH, {
			...options,
			body
		});

		if (response.ok) {
			return 'success'; // Return 'success' if the API call succeeds
		} else {
			throw new Error('API call failed');
		}
	} catch (error) {
		console.error('Error:', error);
		throw error; // Rethrow the error
	}
}
