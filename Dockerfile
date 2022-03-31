# production environment
FROM nginx:stable-alpine
COPY nginx/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]