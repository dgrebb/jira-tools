import { issueTypeConfig } from '@config/jiraIssueTypeConfig.js';

/**
 * Parse markdown string into a JSON object for Jira issues with dynamic issue types and properties.
 * @param {string} markdown - The input markdown string.
 * @returns {object} - Parsed JSON object.
 */
export function parserMdJiraJSONIssues(markdown) {
	const lines = markdown.split('\n');
	const result = {};
	const stack = [];

	for (const line of lines) {
		// Match headings (e.g., #, ##, ###)
		const headingMatch = line.match(/^(#+) (.+)/);
		if (headingMatch) {
			const level = headingMatch[1].length; // Heading level
			const title = headingMatch[2]; // Heading content
			const { type: issuetype, arrayName } = issueTypeConfig[level] || {
				type: 'Unknown',
				arrayName: 'unknowns'
			};

			const newNode = {
				issuetype,
				summary: title
			};

			while (stack.length >= level) stack.pop(); // Adjust stack to current level

			if (stack.length > 0) {
				const parent = stack[stack.length - 1];
				if (!parent[arrayName]) parent[arrayName] = [];
				parent[arrayName].push(newNode);
			} else {
				// Add as top-level issue
				if (!result[arrayName]) result[arrayName] = [];
				result[arrayName].push(newNode);
			}

			stack.push(newNode); // Push current node to the stack
			continue;
		}

		// Match key-value pairs (e.g., - key: value)
		const kvMatch = line.match(/^- (.+?): (.+)/);
		if (kvMatch) {
			const key = kvMatch[1].trim().toLowerCase();
			const value = kvMatch[2].trim();

			// Add as property to the current item in the stack
			if (stack.length > 0) {
				const currentNode = stack[stack.length - 1];
				currentNode[key] = value;
			}
		}
	}

	return result;
}
