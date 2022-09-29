# ERA Responders Portal

## Features

- login with BCeID
- manage team users, suppliers, areas of responsibility
- look up evacuees and needs assessments
- register evacuees and evaluate needs assessments
- issue referrals, e-transfers
- extract data to Excel
## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-responders.embc.gov.bc.ca%2F)

[![ci-responders-portal-api](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-responders-portal-api.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-responders-portal-api.yml)

[![ci-responders-portal-ui](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-responders-portal-ui.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-responders-portal-ui.yml)

## Install

API Env vars:
```s
APP_NAME=dev-responders-portal
ASPNETCORE_ENVIRONMENT=development
messaging__url=https://localhost:2020
messaging__allowInvalidServerCertificate=true
JWT__METADATAADDRESS=<SSO KeyCloak realm url>/.well-known/openid-configuration
JWT__AUDIENCE=<SSO KeyCloak client id>
OIDC__ISSUER=<SSO KeyCloak realm url>
OIDC__CLIENTID=<SSO KeyCloak client id>
OIDC__BCEIDLOGOUTURL=<BCeID logout url, for non prod is it usually https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi>
TIMEOUT__MINUTES=90
TIMEOUT__WARNINGDURATION=4
messaging__authorizationEnabled=true
messaging__oauth__metadataAddress=https://era-oauth-dev.apps.silver.devops.gov.bc.ca/.well-known/openid-configuration
cors__origins=<optional CORS urls for the API>
features__eTransferEnabled=true
```

API secret env vars:

```s
REDIS_CONNECTIONSTRING=<optional redis connection string>
SPLUNK_URL=<optional Splunk collector url>
SPLUNK_TOKEN=<optional Splunk token>
messaging__oauth__clientId=<api client id as defined in oauth server config>
messaging__oauth__clientSecret=<api client secret as defined in oauth server config>
messaging__oauth__scope=ess-backend
```

## Usage

1. set the above env vars in the API project's secrets.json file
2. in `responders/src/API/EMBC.responders.API`, run `dotnet watch`
3. in `responders/src/UI/embc-responder`, run 
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
Note - in both cases, the UI auto generates client side proxy services using the API's OpenAPI specs (http://localhost:6020/api/openapi)

6. run the backend services as described in [ess readme](../ess)
7. open http://localhost:6200