FROM trion/ng-cli-karma AS ng-builder
WORKDIR /src
COPY ./embc-supplier/package*.json ./
RUN npm install
COPY ./embc-supplier/ .
# RUN npm run lint (TODO: need to fix current linter issues before enabling in CI/CD)
RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --prod

FROM caddy:alpine as final
ARG VERSION
ENV VERSION=$VERSION
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/embc-supplier/ /site
ENV API_URL=
EXPOSE 2015 2016