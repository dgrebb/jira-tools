start:
	@make build && make up

build:
	@docker build -t jira-software-arm64:9.13.1 ./docker

reset:
	@docker build --no-cache -t jira-software-arm64:9.13.1 ./docker

up:
	@docker-compose -f ./docker/docker-compose.yml up

plan:
	@cd feature-generator && npm run dev

cascade:
	@cd cascade-cascade && npm run dev

plan-setup:
	@cd feature-generator && npm install

cascade-setup:
	@cd cascade-cascade && npm install