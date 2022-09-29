# ERA Suppliers Portal

## Features

- submit invoices and referrals to be reimbursed by the province
## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-suppliers.embc.gov.bc.ca%2F)

[![ci-suppliers-portal-api](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-suppliers-portal-api.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-suppliers-portal-api.yml)

[![ci-suppliers-portal-ui](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-suppliers-portal-ui.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/ci-suppliers-portal-ui.yml)


## Install

API Env vars:
```s
APP_NAME=local-suppliers-portal
ASPNETCORE_ENVIRONMENT=development
Kestrel__Limits__MaxRequestBodySize=104857600
Dynamics__ADFS__OAuth2TokenEndpoint=<ADFS token endpoint>
Dynamics__DynamicsApiEndpoint=<Dynamics url>/api/data/v9.0/
MAINTENANCE_START=<start time of maintenance window in DateTime formate, i.e. 2021-04-21T11:45:00.000Z (optional)>
NOTICE_MESSAGE=<pre maintenance window message (optional)>
MAINTENANCE_WARNING=<warning maintenance window message (optional)>
MAINTENANCE_PAGEDOWN=<maintenance window message (optional)>
```

API secret env vars:

```s
Dynamics__ADFS__ClientId=<ADFS client id>
Dynamics__ADFS__ClientSecret=<ADFS client secret>
Dynamics__ADFS__ResourceName=<ADFS resource name>
Dynamics__ADFS__serviceAccountDomain=<Dynamics service account domain>
Dynamics__ADFS__serviceAccountName=<Dynamics service account name>
Dynamics__ADFS__serviceAccountPassword=<Dynamics service account password>
REDIS_CONNECTIONSTRING=<redis cache connection string (optional)>
SPLUNK_URL=<Splunk collector url (optional)>
SPLUNK_TOKEN=<Splunk token (optional)>
```

## Usage

1. set the above env vars in the API project's secrets.json file
2. in `suppliers/src/API/EMBC.Suppliers.API`, run `dotnet watch`
3. in `suppliers/src/UI/embc-supplier`, run 
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
Note - in both cases, the UI auto generates client side proxy services using the API's OpenAPI specs (http://localhost:5000/api/openapi)

1. open http://localhost:3200