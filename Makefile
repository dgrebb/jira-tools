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
	@cd release-cascade && npm run dev

plan-setup:
	@cd feature-generator && npm install

cascade-setup:
	@cd release-cascade && npm install

build-confluence:
	@docker build -t confluence-server-arm64:8.5.7 -f ./docker/Dockerfile-confluence ./docker