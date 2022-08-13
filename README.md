how to make http to https
pre-requisite
 - http://domain.com is successfully created


# create manual ssl for free
1. create folder ssl
2. chmod that file to 700
3. sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/nginx-selfsigned.key -out ssl/nginx-selfsigned.crt
4. fill your domain in comman name
5. sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
6. configure nginx to use certificate in ssl/ folder
notes: full walkthrough see https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-on-centos-7


# getting a certificate by certbot
[this must be done on remote server]
1. run nginx docker with configuration /env/prod/nginx.conf, it will make remote server accept http
    preparation
        - docker image
        - prepare default.conf phase 1
        - copy conf to folder nginx/conf in server
        - folder nginx/conf -> contain nginx.conf
        - folder certbot/www -> empty
        - folder certbot/conf -> empty
    command:
        - run nginx:latest container with "make run-webserver" (detail in makefile, don't forget to export CURDIR)
    checking:
        - curl to your domain to test if its okay

2. remote server has already accept traffic, then dry-run
    command:
        - make certbot-dry-run (detail in makefile, dont forget to export CURDIR and MYDOMAIN)

3. dry-run will create populate certbot/conf. Since this folder is mounted on nginx, nginx will get every folder that is written by certbot

4. stop certbot container. It is expected that dry-run to exited in container

5. use default.conf phase 2

6. use "make certbot-create" (detail in makefile) to get the certificate, it will be populate certbot/www

6. keep every file on certbot/www and certbot/conf. and mount it on your nginx deployment. see "make prod-run"

7. use "make certbot-renew" if you want to renew your certificate

notes: see full walkthrough here https://mindsers.blog/post/https-using-nginx-certbot-docker/



# local run
notes: you need to run in system-design repo, in this part you only need to build it
1. check your .env
2. make build-local
3. if you want to run it, docker-compose up -d in system design

# production run
notes: you need only build and ship it to docker registry the newest image
1. check your .prod.env
2. check your default.conf, use production nginx https
3. make build-prod
4. make push
5. follow system-design production run in readme