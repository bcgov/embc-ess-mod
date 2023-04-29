FROM trion/ng-cli-karma AS node-builder
WORKDIR /src
COPY ./embc-responder/package*.json ./
RUN npm install --ignore-scripts
COPY ./embc-responder/ .

FROM node-builder as ng-builder
#RUN npm run lint
RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --configuration production

FROM caddy:2-builder AS caddy-builder
RUN xcaddy build \
    --with github.com/caddyserver/replace-response

FROM caddy:2 as final
ARG VERSION
ENV VERSION=$VERSION
ENV API_URL=
RUN chmod +rw /config/caddy
COPY --from=caddy-builder /usr/bin/caddy /usr/bin/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/embc-responder/ /site
EXPOSE 2015 2016