# Jira Tools

## Docker

Commands are in the `Makefile` to simplify installation.

1. run `make build`
2. run `make compose-up`
3. open `http://localhost:8080`
4. configure Jira

As can be seen in the [`docker-compose.yaml`](docker/docker-compose.yml) file, settings for Jira, on first run, are:

- Hostname: `postgresql`
- Port: `5432`
- Database: `jiradb`
- Username: `jira`
- Password: `Postgres_password`
- Schema: `public`

6. click next
7. you'll be prompted for a license — Atlassian will create a 90-day trial key (free with Atlassian account)
8. the remaining prompts will guide through Jira configuration

For detailed steps read this: [Engineering in Program Management — Run Jira Server in Docker](https://www.dgrebb.com/post/engineering-in-program-management-run-jira-server-in-docker/)