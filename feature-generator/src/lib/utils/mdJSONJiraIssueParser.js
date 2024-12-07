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
		const headingMatch = line.match(/^(#+) (.+)/);
		if (headingMatch) {
			const level = headingMatch[1].length;
			const title = headingMatch[2];
			const issueType = issueTypeConfig[level] || 'unknown';

			const newNode = {
				issue_type: issueType,
				summary: title,
				children: []
			};

			while (stack.length >= level) stack.pop();
			if (stack.length > 0) {
				const parent = stack[stack.length - 1];
				parent.children.push(newNode);
			} else {
				if (!result[issueType]) result[issueType] = [];
				result[issueType].push(newNode);
			}

			stack.push(newNode);
			continue;
		}

		const kvMatch = line.match(/^- (.+?): (.+)/);
		if (kvMatch) {
			const key = toSnakeCase(kvMatch[1].trim());
			const value = kvMatch[2].trim();

			if (stack.length > 0) {
				const currentNode = stack[stack.length - 1];
				currentNode[key] = value;
			}
		}
	}

	return result;
}
