FROM trion/ng-cli-karma AS ng-builder
WORKDIR /src
COPY ./EMBC.Registrants.UI/package*.json ./
RUN npm install --ignore-scripts
COPY ./EMBC.Registrants.UI/ .
RUN npm run lint
RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --configuration production

FROM caddy:alpine as final
COPY build/Registrants/Caddyfile /etc/caddy/Caddyfile
COPY --from=ng-builder /src/dist/embc-registrant/ /site
ENV API_URL=
ENV LOG_LEVEL=INFO
EXPOSE 2015 2016
