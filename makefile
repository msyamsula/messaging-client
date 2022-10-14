ship:
	npm run build
	docker build -t syamsuldocker/syamsulapp-client:${TAG} .
	docker push syamsuldocker/syamsulapp-client:${TAG}