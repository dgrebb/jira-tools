/**
 * Normalize string to snake_case.
 * @param {string} str - The input string.
 * @returns {string} - Normalized snake_case string.
 */
export function toSnakeCase(str) {
	return str
		.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
		.replace(/[\s\-]+/g, '_')
		.toLowerCase();
}
