FROM trion/ng-cli-karma AS ng-builder
WORKDIR /src
COPY ./embc-responder/package*.json ./
RUN npm install
COPY ./embc-responder/ .
RUN npm run lint
RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --prod

FROM caddy:alpine as final
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/embc-responder/ /site
ENV API_URL=
EXPOSE 2015