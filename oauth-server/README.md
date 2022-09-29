# OAuth Server

A hosting service for [Identity Server 4](https://github.com/IdentityServer/IdentityServer4)

## Features 

- a central OAuth2 authorization server for internal services communications
- an OIDC intermediate provider for BC Services Card Auth code flow + PKCE
- can use redis or sqlite as the cache and operational store
- Supports a predefined test users list which can be used as part of load testing or automated testing

## Project status

[![ci-oauth-server](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-oauth-server.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-oauth-server.yml)

## Installation

API Env vars:
```s
APP_NAME=oauth-server
ASPNETCORE_ENVIRONMENT=development
IDENTITYSERVER_REDIS_KEY_PREFIX=
IDENTITYSERVER_REDIS_OPERATIONALSTORE=false
IDENTITYSERVER_REDIS_CACHE=false
IDENTITYSERVER_CONFIG_FILE=./Data/config.json
IDENTITYSERVER_TESTUSERS_FILE=./Data/test_users.json
```

API secret env vars:

```s
REDIS_CONNECTIONSTRING=<optional redis connection string>
identityProviders__bcsc__clientId=<BCSC client id>
identityProviders__bcsc__clientSecret=<BCSC client secret>
identityProviders__bcsc__metadataAddress=<BCSC well known oidc metadata endpoint url>
SPLUNK_URL=<optional Splunk collector url>
SPLUNK_TOKEN=<optional Splunk token>
ConnectionStrings__DefaultConnection=Data Source=./Data/IdentityServer.db;
```

## Usage

1. set the above env vars in the API project's secrets.json file
2. change all configuration variables in registrants, responders portals, and ESS backend that references `https://era-oauth-dev.apps.silver.devops.gov.bc.ca` to `https://localhost:8020`
3. ensure `oauth-server\src\API\OAuthServer\Data\config.json` has the matching client ids and secrets
4. in `oauth-server/src/api/OAuthServer`, run `dotnet watch`
5. run the portals and backend service
