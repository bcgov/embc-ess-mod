FROM node:lts-alpine AS ng-builder
WORKDIR /src
COPY ./embc-supplier/package*.json ./
RUN npm install
COPY ./embc-supplier/ .
RUN npm run build

FROM caddy:builder AS caddy-builder
RUN caddy-builder

FROM caddy:alpine as final
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/embc-supplier/ /site
RUN ls -lah /site
