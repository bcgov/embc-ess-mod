FROM caddy:alpine as final
ARG VERSION
ENV VERSION=$VERSION
COPY Caddyfile /etc/caddy/Caddyfile
COPY html/ /site/
EXPOSE 2016