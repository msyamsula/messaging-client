# production environment
FROM nginx
COPY build/ /usr/share/nginx/html/
COPY env/dev/default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]