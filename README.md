how to make http to https
pre-requisite
 - http://domain.com is successfully created

# getting a certificate by certbot
[this must be done on remote server]
1. run nginx docker with configuration /env/prod/nginx.conf, it will make remote server accept http
    preparation
        - docker image
        - folder nginx/conf -> contain nginx.conf
        - folder certbot/www -> empty
        - folder certbot/conf -> empty
    command:
        - run nginx:latest container with "make webserver start" (detail in makefile)
    checking:
        - curl to your domain to test if its okay

2. remote server has already accept traffic, then dry-run
    command:
        - make certbot-dry-run (detail in makefile)

3. dry-run will create populate certbot/www and certbot/conf. Since this folder is mounted on nginx, nginx will get every folder that is written by certbot

4. stop certbot container. It is expected that dry-run to exited in container

5. use "make certbot-create" (detail in makefile) to get the certificate, it will be populate certbot/www and certbot/conf

6. keep every file on certbot/www and certbot/conf. and mount it on your nginx deployment. see "make prod-run"

7. use "make certbot-renew" if you want to renew your certificate
