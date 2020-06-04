---
title: EMBC Suppliers Portal
description: EMBC's suppliers' portal
---

# EMBC Suppliers Portal

## Features

A web based portal for EMBC suppliers to submit their invoices and receipts for supports provided to evacuees

## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-suppliers.embc.gov.bc.ca%2F)
![suppliers-portal-ui](https://github.com/bcgov/embc-ess-mod/workflows/master-build-suppliers-portal-ui/badge.svg)
![suppliers-portal-api](https://github.com/bcgov/embc-ess-mod/workflows/master-build-suppliers-portal-api/badge.svg)

## Usage

The portal is accessible from EMBC-ESS landing page, follow the training materials and link provided at ess.gov.bc.ca

# Development

## Requirements

- VS2019
- VSCode
- Docker-Desktop (optional for Docker build and run)

## Local development environment setup

**API**

1. fork the main repository and checkout the fork to your local machine
2. open `suppliers/src/API/EMBC.Suppliers.sln` in Visual Studio
3. right click on `EMBC.Suppliers.API` project and select `Manage User Secrets`
4. add the following configuration values:

```
"Dynamics:ADFS:OAuth2TokenEndpoint": "<BC Gov ADFS OIDC token endpoint url>",
"Dynamics:ADFS:ResourceName": "<Dynamics resource name>",
"Dynamics:ADFS:ClientId": "<client id>",
"Dynamics:ADFS:ClientSecret": "<client secret>",
"Dynamics:ADFS:serviceAccountDomain": "<service account domain>",
"Dynamics:ADFS:serviceAccountName": "<service account name",
"Dynamics:ADFS:serviceAccountPassword": "<service account password>",
"Dynamics:DynamicsApiEndpoint": "https://<Dynamics host url>/api/data/v9.0/"
```

5. The following envirnment variables can be set in `properties/launchSettings.json, these are the default, checked in to github:

```
"Submission_Storage_Path": "%TEMP%",
"Dynamics__Cache__CachePath": "%TEMP%",
"Dynamics__Cache__UpdateFrequency": "1",
"ASPNETCORE_ENVIRONMENT": "Development"
```

6. build and run
7. to test the API, use swagger from `http://localhost:5000/api/swagger` or Postman
8. to run the integration tests, make sure the solution is set to Debug, and that you're connected to the BC GOV VPN service

- To run the API in hot loading from the command line, execute the following command from the root folder of the repository

```
dotnet watch --project .\suppliers\src\API\EMBC.Suppliers.API\ run
```

**UI**

1. cd to `suppliers/src/UI/embc-supplier`
2. run

```
npm install
```

3. run the API
4. to start the portal with hot loading, run

```
ng serve
```

5. use `npm run test` and `npm run lint` to test and lint

**Docker**

1. create .env file with the following env vars:

```
Dynamics__DynamicsApiEndpoint=https://<Dynamics host url>/api/data/v9.0/
Dynamics__ADFS__OAuth2TokenEndpoint=<BC Gov ADFS OIDC token endpoint url>
Dynamics__ADFS__ResourceName=<Dynamics resource name>
Dynamics__ADFS__ClientId=<client id>
Dynamics__ADFS__ClientSecret=<client secret>
Dynamics__ADFS__serviceAccountDomain=<service account domain>
Dynamics__ADFS__serviceAccountName=<service account name>
Dynamics__ADFS__serviceAccountPassword=<service account password>
Dynamics__Cache__CachePath=/dynamics_cache
Submission_Storage_Path=/submissions
```

2. from the root repository folder, run

```
docker-compose up --build
```

3. the API will be available at `http://localhost:8080/api` and the UI will be available at `http://localhost:2015`

# CI/CD

## Pull requests

Every pull request to the main repository will trigger a the CI github workflow. There are 2 workflows, one for the API and one for the UI, and they are triggered only when the respective source changed. For example, a change to the UI will only trigger CI for the UI CI workflow.

the CI pipeline is included in the dockerfile of each deployable unit. The pipeline itself only triggers `docker build` command, if an image can be built, the result is 'pass'.

## Dev deployment

Once the PR is reviewed and merged to master, the CD workflows will start. The exact same build process is invoked as the CI, resulting in the built image being pushed to Openshift and tagged 'latest'. The image tag change will trigger the dev environment deployment and will deploy the latest build.

```
commit to fork -> create PR -> CI build -> merge -> CD build -> automatic deployment in dev
```

## Deployment to higher environments

Higher environment deployments are triggered within Openshift tools project pipelines:

- test - tag `latest` as `test` and trigger test environment deployment
- training - tag `test` as `training` and trigger training environment deployment
- prod - tag `test` as `production` and trigger production environment deployment

```
dev -> test --> training
            \-> production
```
