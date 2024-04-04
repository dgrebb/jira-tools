# Jira Release Cascade UI

This tool makes creating releases across Jira Server projects easier.

## Setup

1. clone the repo
2. `cd release-cascade`
3. `npm install` or `pnpm install`, etc.
4. set up the API
   1. create `apiConfig.js` from `apiConfig.example.js`
   2. replace `JIRA_API_URL` with the Jira Server instance URL
   3. create a [Jira Server Personal Access Token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens)
   4. replace the `JIRA_API_BEARER_TOKEN` value in `apiConfig.js`
   5. check that the `JIRA_API_PATH` defined matches the [server endpoint for Versions](https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/#api/2/version)
5. Include the Jira project keys for which to create Fix Versions (releases) in `src/routes/page.svelte` and pass them into the `<ReleaseForm />` component
6. `npm run dev`
7. open [http://localhost:5173](http://localhost:5173)