build-local:
	npm run build-local
	docker build -t syamsuldocker/messaging-client .
	docker image prune -f
build-prod:
	npm run build-prod
	docker build -t syamsuldocker/messaging-client:v0.0.3 .
	docker image prune -f
push:
	docker push syamsuldocker/messaging-client:v0.0.3
run:
	docker-compose up -d

#non-container run
non-container-run:
	npm run run-local