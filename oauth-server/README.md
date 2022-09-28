---
title: OAuth Server
description: OAuth Server
---
# OAuth Server


## Project status

[![ci-oauth-server](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-oauth-server.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-oauth-server.yml)

## Configuration

API Env vars:
```s
APP_NAME=local-oauth-server
ASPNETCORE_ENVIRONMENT=development
IDENTITYSERVER_REDIS_KEY_PREFIX=
IDENTITYSERVER_REDIS_OPERATIONALSTORE=false
IDENTITYSERVER_REDIS_CACHE=false
```

API secret env vars:

```s
REDIS_CONNECTIONSTRING=<optional redis connection string>
identityProviders__bcsc__clientId=<BCSC client id>
identityProviders__bcsc__clientSecret=<BCSC client secret>
identityProviders__bcsc__metadataAddress=<BCSC well known oidc metadata endpoint url>
SPLUNK_URL=<optional Splunk collector url>
SPLUNK_TOKEN=<optional Splunk token>
ConnectionStrings__DefaultConnection=Data Source=<optional connection string for IdentityServer4 database>
```

## local development environment

1. set the above env vars in the API project's secrets.json file
2. change all configuration variables in registrants, responders portals, and ESS backend that references `https://era-oauth-dev.apps.silver.devops.gov.bc.ca` to `https://localhost:8020`
3. ensure `oauth-server\src\API\OAuthServer\Data\config.json` has the matching client ids and secrets
4. in `oauth-server/src/api/OAuthServer`, run `dotnet watch`
5. run the portals and backend service
