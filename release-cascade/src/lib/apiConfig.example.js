export const JIRA_API_URL = 'http://localhost:8080'; // Replace with the Jira Server URL
export const JIRA_API_PATH = '/rest/api/2/version'; // The Versions API path for Jira Server - this is typically OK to leave as is
export const PROXY_PATH = '/api/v1/create-release'; // The SvelteKit API Proxy in `src/routes/api/v1/create-release` - avoids CORS (this should be replaced in production uses)
export const JIRA_API_BEARER_TOKEN = 'ABcdefGHIjklmnOpQrSTUVwx+yZ'; // Replace with a Jira Personal Access Token
