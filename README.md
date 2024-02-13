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