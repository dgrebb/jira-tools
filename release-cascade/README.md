# Jira Release Cascade UI

This tool makes creating releases across Jira Server projects easier.

## Setup

1. clone the repo
2. `cd release-cascade`
3. `npm install` or `pnpm install`, etc.
4. set up the API
   1. create `apiConfig.js` from `apiConfig.example.js`
   2. create a [Jira Server Personal Access Token](https://confluence.atlassian.com/enterprise/using-personal-access-tokens)
   3. replace the `BEARER` value in `apiConfig.js`
   4. check that the `JIRA_API_PATH` defined matches the server endpoint for Versions
5. `npm run dev`
6. open [http://localhost:5173](http://localhost:5173)