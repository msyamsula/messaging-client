build-local:
	npm run build-local
	docker build -t syamsuldocker/messaging-client .
	docker image prune -f
push:
	docker push syamsuldocker/messaging-client
run:
	docker-compose up -d

#non-container run
non-container-run:
	npm run run-local