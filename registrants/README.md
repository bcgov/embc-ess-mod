
# ERA Registrants Portal

## Features

- anonymous registration submission
- register and login with BC Service Card
## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-evacuees.embc.gov.bc.ca%2F)

[![ci-registrants-portal-api](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-registrants-portal-api.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-registrants-portal-api.yml)

[![ci-registrants-portal-ui](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-registrants-portal-ui.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-registrants-portal-ui.yml)

## Installation

API Env vars:
```s
APP_NAME=local-registrants-portal
ASPNETCORE_ENVIRONMENT=development
messaging__url=https:///localhost:2020
messaging__allowInvalidServerCertificate=true
auth__introspection__authority=https://era-oauth-dev.apps.silver.devops.gov.bc.ca
auth__jwt__authority=https://era-oauth-dev.apps.silver.devops.gov.bc.ca
auth__oidc__issuer=https://era-oauth-dev.apps.silver.devops.gov.bc.ca
TIMEOUT__MINUTES=90
TIMEOUT__WARNINGDURATION=4
messaging__authorizationEnabled=true
messaging__oauth__metadataAddress=https://era-oauth-dev.apps.silver.devops.gov.bc.ca/.well-known/openid-configuration
captcha__url=https://www.google.com/recaptcha/api/siteverify
cors__origins=<optional CORS urls for the API>
```

API secret env vars:

```s
auth__introspection__clientid=<api client id as defined in oauth server config>
auth__introspection__clientSecret=<api client secret as defined in oauth server config>
auth__oidc__clientid=<the UI client id as defined in oauth server config>
REDIS_CONNECTIONSTRING=<optional redis connection string>
SPLUNK_URL=<optional Splunk collector url>
SPLUNK_TOKEN=<optional Splunk token>
messaging__oauth__clientId=<api client id as defined in oauth server config>
messaging__oauth__clientSecret=<api client secret as defined in oauth server config>
messaging__oauth__scope=ess-backend
```

## Usage

1. set the above env vars in the API project's secrets.json file
2. in `registrants/src/API/EMBC.Registrants.API`, run `dotnet watch`
3. in `registrants/src/UI/embc-registrant`, run 
```
npm install --ignore-scripts
```
4. to run the UI with a local API, run
```
npm run startlocal
```
5. to run the UI and use the development environment API, run
```
npm run start
```
Note - in both cases, the UI auto generates client side proxy services using the API's OpenAPI specs (http://localhost:5020/api/openapi)

6. run the backend services as described in [ess readme](../ess)
7. open http://localhost:5200