run:
	npm run build
	docker build -t syamsuldocker/messaging-client .
	docker run -itd --name messaging-client --network=host \
	-v ${CURDIR}/nginx/dev/:/etc/nginx/conf.d/:ro \
	syamsuldocker/messaging-client
stop:
	docker stop messaging-client
	docker rm messaging-client
update:
	make stop
	make run
prod-run:
	docker run -itd --name messaging-client --network=host \
	-v ${CURDIR}/nginx/conf:/etc/nginx/conf.d/:ro \
	-v ${CURDIR}/certbot/conf:/etc/nginx/ssl:ro \
	-v ${CURDIR}/certbot/www:/var/www/certbot/:ro \
	syamsuldocker/messaging-client
webserver-start:
	docker run -itd --name nginx --network=host \
	 -v ${CURDIR}/nginx/conf/:/etc/nginx/conf.d/:ro \
	 -v ${CURDIR}/certbot/www:/var/www/certbot/:ro \
	 -v ${CURDIR}/certbot/conf:/etc/nginx/ssl/:ro \
	 nginx:latest
webserver-stop:
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
	-v ${pwd}/certbot/www:/var/www/certbot/:rw \
	-v ${pwd}/certbot/conf:/etc/letsencrypt/:rw \
	certbot/certbot:latest renew
copy:
	scp -i ~/syamsul.pem ./makefile ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/makefile
	scp -i ~/syamsul.pem ./nginx/conf/nginx.conf ubuntu@ec2-13-215-105-69.ap-southeast-1.compute.amazonaws.com:~/nginx/conf/nginx.conf



