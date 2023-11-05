FROM alpine:latest as base

ARG LOGGER_PASSWORD

RUN apk update && apk add --no-cache apache2-utils

RUN htpasswd -B -b -c htpasswd admin $LOGGER_PASSWORD

FROM nginx:mainline-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=base /htpasswd /etc/nginx/htpasswd

RUN chown -R nginx:nginx /var/cache/nginx /etc/nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80 443
