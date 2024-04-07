# Jira Tools

## Docker

Commands are in the `Makefile` to simplify installation.

1. run `make start`
2. open `http://localhost:8080`
3. configure Jira

As can be seen in the [`docker-compose.yaml`](docker/docker-compose.yml) file, settings for Jira, on first run, are:

- Hostname: `postgresql`
- Port: `5432`
- Database: `jiradb`
- Username: `jira`
- Password: `Postgres_password`
- Schema: `public`

4. click next
5. you'll be prompted for a license — Atlassian will create a 90-day trial key (free with Atlassian account)
6. the remaining prompts will guide through Jira configuration

For detailed steps read this: [Engineering in Program Management — Run Jira Server in Docker](https://www.dgrebb.com/post/engineering-in-program-management-run-jira-server-in-docker/)

## Feature Generator

This is a Svelte, ChatGPT-enabeld app that can create Jira project data in Epic, User Story, Sub-task, and Bug formats with nesting based on instruction.

### Starting

1. run `make plan-setup`
2. run `make plan`

## Release Cascade

This is a small Svelte app that can be used to create releases and "fix" versions across projects.

It needs to be configured via the provided `src/lib/apiConfig.example.js` file, which should be renamed `apiConfig.js`.

### Starting

1. run `make cascade-setup`
2. run `make cascade`