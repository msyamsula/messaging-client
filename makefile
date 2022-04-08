# local run
run-local:
	npm run run-local


# docker local run
build-docker-local:
	npm run build-docker-local
	docker build \
	-t syamsuldocker/messaging-client \
	-f ${CURDIR}/env/dev/Dockerfile \
	.

run-docker-local:
	make build-docker-local
	docker run \
	--rm \
	-it \
	--name messaging-client \
	--network=host \
	syamsuldocker/messaging-client

stop-docker-local:
	docker stop messaging-client
	docker rm messaging-client


# ship
ship-production:
	npm run build-production
	docker build \
	-t syamsuldocker/messaging-client \
	-f ${CURDIR}/env/prod/Dockerfile \
	.
	docker push syamsuldocker/messaging-client
	scp -i ~/syamsul.pem ./makefile ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/makefile
	scp -i ~/syamsul.pem env/prod/default.conf ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/nginx/

# production
run-production:
	docker pull syamsuldocker/messaging-client
	docker run \
	-itd \
	--name messaging-client \
	--network=host \
	-v ${CURDIR}/nginx/:/etc/nginx/conf.d/ \
	-v ${CURDIR}/certbot/www/:/var/www/certbot/ \
	-v ${CURDIR}/certbot/conf/:/etc/nginx/ssl/ \
	syamsuldocker/messaging-client

stop-production:
	docker stop messaging-client
	docker rm messaging-client

restart-production:
	make stop-production
	make run-production

# ssh convenient
ssh:
	ssh -i ~/syamsul.pem ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com


# https tools
run-webserver:
	docker run -itd --name nginx --network=host \
	 -v ${CURDIR}/nginx/conf/:/etc/nginx/conf.d/:ro \
	 -v ${CURDIR}/certbot/www:/var/www/certbot/:ro \
	 -v ${CURDIR}/certbot/conf:/etc/nginx/ssl/:ro \
	 nginx:latest
stop-webserver:
	docker stop nginx
	docker rm nginx
certbot-dry-run:
	docker run -it --name certbot --network=host \
	-v ${CURDIR}/certbot/www:/var/www/certbot/:rw \
	-v ${CURDIR}/certbot/conf:/etc/letsencrypt/:rw \
	certbot/certbot:latest certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d msyamsula.com
certbot-create:
	docker run -it --name certbot --network=host \
	-v ${CURDIR}/certbot/www:/var/www/certbot/:rw \
	-v ${CURDIR}/certbot/conf:/etc/letsencrypt/:rw \
	certbot/certbot:latest certonly --webroot --webroot-path /var/www/certbot/ -d msyamsula.com
certbot-stop:
	docker stop certbot
	docker rm certbot
certbot-renew:
	docker run -it --name certbot --network=host \
	-v ${CURDIR}/certbot/www:/var/www/certbot/:rw \
	-v ${CURDIR}/certbot/conf:/etc/letsencrypt/:rw \
	certbot/certbot:latest renew

# ========================================
# kubernetes
# EXPERIMENT
kube-build:
	npm run kube-build
	docker build -t syamsuldocker/messaging-client-kubernetes:v${version} \
	-f env/kube/Dockerfile .

kube-ship:
	make version=${version} kube-build
	docker push syamsuldocker/messaging-client-kubernetes:v${version}

kube-run-dev:
	make version=${version} kube-build
	docker run -it --name messaging-client --network=host syamsuldocker/messaging-client-kubernetes:v${version}

kube-stop:
	docker stop messaging-client
	docker rm messaging-client