run:
	npm run build
	docker build -t syamsuldocker/messaging-client .
	docker run -itd --name messaging-client --network=host syamsuldocker/messaging-client
stop:
	docker stop messaging-client
	docker rm messaging-client
update:
	make stop
	make run
prod-run:
	docker run -itd --name messaging-client --network=host syamsuldocker/messaging-client


