# local
run-local:
	npm run run-local

build-local:
	npm run build-local
	docker build \
	-t syamsuldocker/messaging-client \
	-f Dockerfile \
	.

# production
build-prod:
	npm run build-prod
	docker build \
	-t syamsuldocker/messaging-client \
	-f Dockerfile \
	.

push:
	docker push syamsuldocker/messaging-client


## obsolete
run:
	make build-local-cluster
	docker-compose -f ${CURDIR}/env/dev/docker-compose.yaml up -d

stop:
	docker-compose -f ${CURDIR}/env/dev/docker-compose.yaml down

ps:
	docker-compose -f ${CURDIR}/env/dev/docker-compose.yaml ps


# ship
ship-production:
	npm run build-production
	docker build \
	-t syamsuldocker/messaging-client \
	-f ${CURDIR}/env/prod/Dockerfile \
	.
	docker push syamsuldocker/messaging-client
	scp -i ~/syamsul.pem ./makefile ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/makefile
	scp -i ~/syamsul.pem env/prod/docker-compose.yaml ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/

# production
run-production:
	docker pull syamsuldocker/messaging-client
	docker-compose up -d

stop-production:
	docker-compose down

restart-production:
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
	npm run build-kube
	docker build \
	-t syamsuldocker/messaging-client-kubernetes:v${version} \
	-f env/kube/Dockerfile \
	.

kube-ship:
	make version=${version} kube-build
	docker push syamsuldocker/messaging-client-kubernetes:v${version}

kube-redirect:
	make stop-production
	docker run \
	-itd \
	--name nginx \
	--network=host \
	-v ${CURDIR}/nginx/:/etc/nginx/conf.d/ \
	-v ${CURDIR}/certbot/www/:/var/www/certbot/ \
	-v ${CURDIR}/certbot/conf/:/etc/nginx/ssl/ \
	nginx